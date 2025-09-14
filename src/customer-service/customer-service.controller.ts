import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Post,
  UnauthorizedException,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import type { Express } from 'express';
import type { Multer } from 'multer';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { CustomerServiceService } from './customer-service.service';
import { ViewProfileDto } from './Dto/view_profilet_dto';
import { UpdateProfileDto } from './Dto/update-profile.dto';
import { CustomerResponseDto } from './Dto/Customer_response.dto';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerServiceController {
  constructor(private readonly customerService: CustomerServiceService) {}

  private ensureUploadsDirectory(role: string): string {
    const uploadPath = path.join(process.cwd(), 'uploads', `${role}-images`);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
  }

  @Get('profile')
  @UsePipes(new ValidationPipe())
  async getProfile(@Req() req: Request): Promise<CustomerResponseDto> {
    const response = new CustomerResponseDto();
    try {
      const userId = (req.user as any).sub;
      const profile = await this.customerService.getProfile(userId);
      response.status = true;
      response.data = profile;
      response.statusCode = HttpStatus.OK;
      response.message = 'Profile retrieved successfully';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Put('profile')
  @UsePipes(new ValidationPipe())
  async updateProfile(
    @Req() req: Request,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<CustomerResponseDto> {
    const response = new CustomerResponseDto();
    try {
      const userId = (req.user as any).sub;
      const profile = await this.customerService.updateProfile(
        userId,
        updateDto,
      );
      response.status = true;
      response.data = profile;
      response.statusCode = HttpStatus.OK;
      response.message = 'Profile updated successfully';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Post('profile/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadProfileImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CustomerResponseDto> {
    const response = new CustomerResponseDto();
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const userId = (req.user as any).sub;
      const userRole = (req.user as any).role;

      if (!userRole) {
        throw new BadRequestException('Invalid user role');
      }

      const roleFolder = userRole.toLowerCase();
      const uploadPath = this.ensureUploadsDirectory(roleFolder);

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      const fullPath = path.join(uploadPath, filename);

      fs.writeFileSync(fullPath, file.buffer);

      const imagePath = `/${roleFolder}-images/${filename}`;
      const profile = await this.customerService.updateProfileImage(
        userId,
        imagePath,
      );

      response.status = true;
      response.data = profile;
      response.statusCode = HttpStatus.OK;
      response.message = 'Profile image uploaded successfully';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Delete('account')
  async deleteAccount(@Req() req: Request): Promise<CustomerResponseDto> {
    const response = new CustomerResponseDto();
    try {
      const userId = (req.user as any).sub;
      await this.customerService.deleteAccount(userId);
      response.status = true;
      response.statusCode = HttpStatus.OK;
      response.message = 'Account deleted successfully';
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }
}
