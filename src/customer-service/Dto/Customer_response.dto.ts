import { HttpStatus } from '@nestjs/common';

export class CustomerResponseDto {
  status: boolean;
  error?: string;
  data?: any;
  statusCode?: HttpStatus;
  message?: string;
}