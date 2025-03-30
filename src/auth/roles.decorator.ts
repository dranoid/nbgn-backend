import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from './dto/roles.enum';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
