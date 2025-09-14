import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 25,
        secure: false,
        auth: {
          user: 'eliasjabershafin100@gmail.com',
          pass: 'qwbdiiwlvmmopcuy',
        },
      },
      defaults: {
        from: '"No Reply" <eliasjabershafin100@gmail.com>',
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
