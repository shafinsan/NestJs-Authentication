import {
  Controller,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminUserControlService } from './admin-user-control.service';

import { UserRole } from './Utility/constants';
import { Roles } from './gurd/roles.decorator';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from './gurd/roles.guard';
import { PaginationDto } from './dto/PaginationDto';


@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUserControlController {
  constructor(
    private readonly adminUserControlService: AdminUserControlService,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.adminUserControlService.findAllUsers(paginationDto);
  }

@Get('search-by-email')
async searchByEmail(
  @Query('email') email: string,
  @Query() paginationDto: PaginationDto,
) {
  return this.adminUserControlService.searchUsersByEmail(email, paginationDto);
}

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminUserControlService.updateUserStatus(id, isActive);
  }

  @Put(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
  ) {
    return this.adminUserControlService.updateUserRole(id, roleId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminUserControlService.deleteUser(id);
  }
}