import { Module } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceController } from './customer-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/Entity/User.entity';
import { CustomerProfile } from './Entities/customer_profile.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User,CustomerProfile]),JwtModule.register({})], 
  providers: [CustomerServiceService],
  controllers: [CustomerServiceController]
})
export class CustomerServiceModule {}
