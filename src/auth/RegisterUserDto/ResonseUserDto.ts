import { HttpStatus } from '@nestjs/common';

export class ResponseUserDto {
  status: boolean;
  error?: string;
  data?: {
    accessToken?: string;
    id?: string;
    email?: string;
    username?: string;
    role?: string;
    isValid?: boolean;
  };
  statusCode?: HttpStatus;
  message?: string;
}
