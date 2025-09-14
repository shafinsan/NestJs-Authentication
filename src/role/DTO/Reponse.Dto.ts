import { HttpStatus } from '@nestjs/common';

export class ResponseRoleDto {
  status: boolean;
  error?: string;
  data?: any;
  statusCode?: HttpStatus;
}
