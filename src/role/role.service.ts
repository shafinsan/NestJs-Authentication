import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRole } from './ENTITY/Entity.Role';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(EntityRole)
    private readonly roleRepo: Repository<EntityRole>,
  ) {}
  async createRole(roleData: Partial<EntityRole>): Promise<EntityRole> {
    const role = this.roleRepo.create(roleData);
    return this.roleRepo.save(role);
  }
  async findAllRoles(): Promise<EntityRole[]> {
    return this.roleRepo.find();
  }
  async findRoleById(id: string): Promise<EntityRole |null> {
    return this.roleRepo.findOne({ where: { id } });
  }
  async updateRole(
    id: string,
    roleData: Partial<EntityRole>,
  ): Promise<EntityRole|null> {
    await this.roleRepo.update(id, roleData);
    return this.findRoleById(id);
  }
  async deleteRole(id: string): Promise<void> {
    await this.roleRepo.delete(id);
  }
  async findRoleByName(name: string): Promise<EntityRole[]> {
    return this.roleRepo.find({ where: { name } });
  }
  async findRolesByPartialName(partialName: string): Promise<EntityRole[]> {
    return this.roleRepo
      .createQueryBuilder('role')
      .where('role.name ILIKE :name', { name: `%${partialName}%` })
      .getMany();
  }
  async countRoles(): Promise<number> {
    return this.roleRepo.count();
  }
  async roleExists(id: string): Promise<boolean> {
    const count = await this.roleRepo.count({ where: { id } });
    return count > 0;
  }
  async findRolesWithPagination(
    skip: number,
    take: number,
  ): Promise<EntityRole[]> {
    return this.roleRepo.find({ skip, take });
  }
  async findRolesWithSorting(
    orderBy: string,
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<EntityRole[]> {
    return this.roleRepo.find({ order: { [orderBy]: order } });
  }
  async findRolesWithFilters(
    filters: Partial<EntityRole>,
): Promise<EntityRole[]> {
    return this.roleRepo.find({ 
        where: filters as FindOptionsWhere<EntityRole> 
    });
}
    
}
