import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { EntityRole } from './ENTITY/Entity.Role';
import { ResponseRoleDto } from './DTO/Reponse.Dto';
import { RoleDto } from './DTO/Role.Dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createRole(@Body() roleDto: RoleDto): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const role = await this.roleService.createRole(roleDto);
      response.status = true;
      response.data = role;
      response.statusCode = HttpStatus.CREATED;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.BAD_REQUEST;
    }
    return response;
  }

  @Get()
  @UsePipes(new ValidationPipe())
  async findAllRoles(): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const roles = await this.roleService.findAllRoles();
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async findRoleById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const role = await this.roleService.findRoleById(id);
      if (!role) {
        response.status = false;
        response.error = 'Role not found';
        response.statusCode = HttpStatus.NOT_FOUND;
      } else {
        response.status = true;
        response.data = role;
        response.statusCode = HttpStatus.OK;
      }
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() roleDto: RoleDto,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const updatedRole = await this.roleService.updateRole(id, roleDto);
      if (!updatedRole) {
        response.status = false;
        response.error = 'Role not found';
        response.statusCode = HttpStatus.NOT_FOUND;
      } else {
        response.status = true;
        response.data = updatedRole;
        response.statusCode = HttpStatus.OK;
      }
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.BAD_REQUEST;
    }
    return response;
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteRole(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      await this.roleService.deleteRole(id);
      response.status = true;
      response.data = null;
      response.statusCode = HttpStatus.NO_CONTENT;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('search/by-name')
  @UsePipes(new ValidationPipe())
  async findRolesByName(@Query('name') name: string): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const roles = await this.roleService.findRoleByName(name);
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('search/by-partial-name')
  @UsePipes(new ValidationPipe())
  async findRolesByPartialName(
    @Query('name') partialName: string,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const roles = await this.roleService.findRolesByPartialName(partialName);
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('data/count')
  @UsePipes(new ValidationPipe())
  async countRoles(): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const count = await this.roleService.countRoles();
      response.status = true;
      response.data = { count };
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('exists/:id')
  @UsePipes(new ValidationPipe())
  async roleExists(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const exists = await this.roleService.roleExists(id);
      response.status = true;
      response.data = { exists };
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('data/paginate')
  @UsePipes(new ValidationPipe())
  async findRolesWithPagination(
    @Query('skip') skipStr: string,
    @Query('take') takeStr: string,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const skip = parseInt(skipStr, 10) || 0;
      const take = parseInt(takeStr, 10) || 10;
      const roles = await this.roleService.findRolesWithPagination(skip, take);
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Get('data/sort')
  @UsePipes(new ValidationPipe())
  async findRolesWithSorting(
    @Query('orderBy') orderBy: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const roles = await this.roleService.findRolesWithSorting(orderBy, order);
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }

  @Post('filter')
  @UsePipes(new ValidationPipe())
  async findRolesWithFilters(
    @Body() filters: Partial<EntityRole>,
  ): Promise<ResponseRoleDto> {
    const response = new ResponseRoleDto();
    try {
      const roles = await this.roleService.findRolesWithFilters(filters);
      response.status = true;
      response.data = roles;
      response.statusCode = HttpStatus.OK;
    } catch (error) {
      response.status = false;
      response.error = error.message;
      response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response;
  }
}
