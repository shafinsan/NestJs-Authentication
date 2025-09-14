import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { EntityRole } from './ENTITY/Entity.Role';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/Entity/User.entity';


@Module({
  imports: [TypeOrmModule.forFeature([EntityRole]),User],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
