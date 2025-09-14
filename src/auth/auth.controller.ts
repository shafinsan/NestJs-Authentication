import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseUserDto } from './RegisterUserDto/ResonseUserDto';
import { RegisterUserDto } from './RegisterUserDto/RegisterUserDto';
import { LoginUserDto } from './LoginUserDto/LoginUserDto';
import {
  NewPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './RegisterUserDto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const result = await this.authService.register(registerDto);
      response.status = true;
      response.statusCode = HttpStatus.CREATED;
      response.message = result.message;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('activate')
  @UsePipes(new ValidationPipe())
  async activateAccount(
    @Query('token') token: string,
  ): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const result = await this.authService.activateAccount(token);
      response.status = true;
      response.statusCode = HttpStatus.OK;
      response.message = result.message;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.BAD_REQUEST;
    }
    return response;
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginUserDto): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const { accessToken, user } = await this.authService.login(loginDto);
      response.status = true;
      response.data = {
        accessToken,
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name,
      };
      response.statusCode = HttpStatus.OK;
      response.message = 'Login successful';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.UNAUTHORIZED;
    }
    return response;
  }
  @Post('forgot-password')
  @UsePipes(new ValidationPipe())
  async forgotPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const result =
        await this.authService.requestPasswordReset(resetPasswordDto);
      response.status = true;
      response.statusCode = HttpStatus.OK;
      response.message = result.message;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.BAD_REQUEST;
    }
    return response;
  }

  @Post('verify-otp')
  @UsePipes(new ValidationPipe())
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto);
      response.status = true;
      response.data = { isValid: result.isValid };
      response.statusCode = HttpStatus.OK;
      response.message = result.isValid ? 'OTP is valid' : 'Invalid OTP';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.BAD_REQUEST;
    }
    return response;
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe())
  async resetPassword(
    @Body() newPasswordDto: NewPasswordDto,
  ): Promise<ResponseUserDto> {
    const response = new ResponseUserDto();
    try {
      const result = await this.authService.resetPassword(newPasswordDto);
      response.status = true;
      response.statusCode = HttpStatus.OK;
      response.message = result.message;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.BAD_REQUEST;
    }
    return response;
  }
}
