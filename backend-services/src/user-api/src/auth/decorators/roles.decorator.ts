import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum/user-role';

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
