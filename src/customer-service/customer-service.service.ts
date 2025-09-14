import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/Entity/User.entity';
import { CustomerProfile } from './Entities/customer_profile.entity';
import { ViewProfileDto } from './Dto/view_profilet_dto';
import { UpdateProfileDto } from './Dto/update-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepository: Repository<CustomerProfile>,
  ) {}

  async getProfile(userId: string): Promise<ViewProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.profile?.bio,
      dateOfBirth: user.profile?.dateOfBirth,
      gender: user.profile?.gender,
      phoneNumber: user.profile?.phoneNumber,
      nationality: user.profile?.nationality,
      religion: user.profile?.religion,
      currentLocation: user.profile?.currentLocation,
      zip: user.profile?.zip,
      hometown: user.profile?.hometown,
      role: user.role.name,
    };
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<ViewProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let profile = user.profile;
    if (!profile) {
      profile = new CustomerProfile();
      profile.user = user;
    }

    // Update all profile fields from the DTO
    profile.bio = updateDto.bio ?? profile.bio;
    profile.dateOfBirth = updateDto.dateOfBirth ?? profile.dateOfBirth;
    profile.gender = updateDto.gender ?? profile.gender;
    profile.phoneNumber = updateDto.phoneNumber ?? profile.phoneNumber;
    profile.nationality = updateDto.nationality ?? profile.nationality;
    profile.religion = updateDto.religion ?? profile.religion;
    profile.currentLocation =
      updateDto.currentLocation ?? profile.currentLocation;
    profile.zip = updateDto.zip ?? profile.zip;
    profile.hometown = updateDto.hometown ?? profile.hometown;

    await this.profileRepository.save(profile);
    return this.getProfile(userId);
  }

  async updateProfileImage(
    userId: string,
    imagePath: string,
  ): Promise<ViewProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

  
    if (user.profileImage) {
      await this.deleteProfileImage(user.profileImage);
    }

    user.profileImage = imagePath;
    await this.userRepository.save(user);

    return this.getProfile(userId);
  }
  private async deleteProfileImage(imagePath: string): Promise<void> {
  
    if (!imagePath?.trim()) return;

    try {
      const normalizedPath = imagePath
        .replace(/^\/+/, '')
        .replace(/\.\.\//g, '');

      const fullPath = path.join(process.cwd(), 'uploads', normalizedPath);

      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fullPath.startsWith(uploadsDir)) {
        throw new Error(
          'Invalid image path - potential directory traversal attempt',
        );
      }

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
      }
    } catch (err) {}
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

   
    if (user.profileImage) {
      await this.deleteProfileImage(user.profileImage);
    }

    if (user.profile) {
      await this.profileRepository.remove(user.profile);
    }

    await this.userRepository.remove(user);
  }
}
