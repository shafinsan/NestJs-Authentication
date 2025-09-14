import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../Utility/constants';


export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);