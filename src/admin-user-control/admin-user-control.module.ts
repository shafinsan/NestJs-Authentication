import { Module } from '@nestjs/common';
import { AdminUserControlService } from './admin-user-control.service';
import { AdminUserControlController } from './admin-user-control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/Entity/User.entity';
import { CustomerProfile } from 'src/customer-service/Entities/customer_profile.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, CustomerProfile]),JwtModule.register({})],
  providers: [AdminUserControlService],
  controllers: [AdminUserControlController],
})
export class AdminUserControlModule {}
