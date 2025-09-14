import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

import { EntityRole } from '../role/ENTITY/Entity.Role';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterUserDto } from './RegisterUserDto/RegisterUserDto';
import { User } from './Entity/User.entity';
import { LoginUserDto } from './LoginUserDto/LoginUserDto';
import { UserResponseDto } from './RegisterUserDto/UserResponseDto';
import { NewPasswordDto, ResetPasswordDto, VerifyOtpDto } from './RegisterUserDto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EntityRole)
    private readonly roleRepository: Repository<EntityRole>,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto): Promise<{ message: string }> {
   
  
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const clientRole = await this.roleRepository.findOne({
      where: { name: 'Admin' },
    });
    if (!clientRole) {
      throw new InternalServerErrorException('Default Client role not found');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

   

    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: clientRole,
      roleId: clientRole.id,
      activationToken,
      activationTokenExpires,
      isActive: false,
    });

    await this.userRepository.save(user);
    await this.sendActivationEmail(user.email, activationToken);

    return {
      message:
        'Registration successful. Please check your email to activate your account.',
    };
  }

  async activateAccount(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { activationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid activation token');
    }
    if (
      !user.activationTokenExpires ||
      user.activationTokenExpires < new Date()
    ) {
      throw new UnauthorizedException('Activation token has expired');
    }

    user.isActive = true;
    user.activationToken = null;
    user.activationTokenExpires = null;
    await this.userRepository.save(user);

    return { message: 'Account activated successfully' };
  }

  async login(
    loginDto: LoginUserDto,
  ): Promise<{ accessToken: string; user: UserResponseDto }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['role'],
    });
    console.log('User found:', user);
     const compare =
      '$2b$10$TobeTuSpn5oHeTZ9Ahx1uOJEcz4BmcV0T8BCX3NHL8gpt1glPUFaa';
    const passwordMatchess = await bcrypt.compare(
      'securePassword123',
      compare || '',
    );
    console.log('Password match:', passwordMatchess);

    console.log('dto:', typeof loginDto.password);
    if(loginDto.password=== 'securePassword123'){
      console.log('hi:', passwordMatchess);
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );
    console.log('Password match:', passwordMatches);

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account not activated. Please check your email.',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      iat: Math.floor(Date.now() / 1000),
    };

    const { password, ...userWithoutPassword } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        ...userWithoutPassword,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
      } as UserResponseDto,
    };
  }


  private async sendActivationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const activationLink = `http://localhost:3001/auth/activate?token=${token}`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Our Service!</h2>
      <p style="color: #555;">Please click the button below to activate your account:</p>
      <a href="${activationLink}" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0;">
        Activate Account
      </a>
      <p style="color: #777; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Account Activation',
      html: htmlContent,
    });
  }
  async requestPasswordReset(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ 
      where: { email: resetPasswordDto.email } 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 3); 

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await this.userRepository.save(user);

    await this.sendOtpEmail(user.email, otp);

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ isValid: boolean }> {
    const user = await this.userRepository.findOne({ 
      where: { 
        email: verifyOtpDto.email,
        resetPasswordOtp: verifyOtpDto.otp 
      } 
    });

    if (!user || !user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < new Date()) {
      return { isValid: false };
    }

    return { isValid: true };
  }

async resetPassword(newPasswordDto: NewPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ 
      where: { email: newPasswordDto.email } 
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

   
    if (!user.resetPasswordOtpExpires || user.resetPasswordOtpExpires < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

 
    const hashedPassword = await bcrypt.hash(newPasswordDto.newPassword, 10);
    
    
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
}
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #555;">Your OTP for password reset is:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${otp}</div>
      <p style="color: #555;">This OTP is valid for 3 minutes.</p>
      <p style="color: #777; font-size: 12px;">If you didn't request this, please ignore this email.</p>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      html: htmlContent,
    });
  }
}
