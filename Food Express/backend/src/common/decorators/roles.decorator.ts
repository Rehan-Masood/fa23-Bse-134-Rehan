import { SetMetadata } from '@nestjs/common';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY_PERSON = 'DELIVERY_PERSON',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
