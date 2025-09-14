import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User } from '../auth/Entity/User.entity';
import { CustomerProfile } from '../customer-service/Entities/customer_profile.entity';
import { PaginationDto } from './dto/PaginationDto';

@Injectable()
export class AdminUserControlService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepository: Repository<CustomerProfile>,
  ) {}

  async findAllUsers(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.userRepository.find({
      relations: ['role', 'profile'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

 async searchUsersByEmail(
  email: string,
  paginationDto: PaginationDto,
) {
  if (!email || email.trim() === '') {
    throw new BadRequestException('Email cannot be empty');
  }

  const { limit = 10, offset = 0 } = paginationDto;

  const [users, total] = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role')
    .leftJoinAndSelect('user.profile', 'profile')
    .where('user.email LIKE :email', { email: `%${email}%` })
    .orderBy('user.createdAt', 'DESC')
    .take(limit)
    .skip(offset)
    .getManyAndCount();

  return {
    users,
    total,
    limit,
    offset,
  };
}

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = isActive;
    return this.userRepository.save(user);
  }

  async updateUserRole(id: string, roleId: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.roleId = roleId;
    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profile) {
      await this.profileRepository.remove(user.profile);
    }

    return this.userRepository.remove(user);
  }
}
