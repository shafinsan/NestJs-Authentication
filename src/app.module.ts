import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerServiceModule } from './customer-service/customer-service.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminUserControlModule } from './admin-user-control/admin-user-control.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'nozomi.proxy.rlwy.net',
      port: 50962,
      username: 'postgres',
      password: 'iPtPCqyuCUZXrJzkZcFqMZUhBsJQtOZj',
      database: 'railway',
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false, 
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RoleModule,
    AuthModule,
    AdminUserControlModule,

    CustomerServiceModule,

    AdminUserControlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
