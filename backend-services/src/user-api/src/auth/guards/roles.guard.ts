import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/user-role';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];
    const rolesClass = this.reflector.get<UserRole[]>('roles', context.getClass()) || [];
    const allowedRoles = [...roles, ...rolesClass];
    if (!allowedRoles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const { scopeContext } = ctx.getContext().req;
    if (!scopeContext) {
      return false;
    }
    const userRoles = scopeContext.roles;
    const matchingRoles = allowedRoles.filter((allewedRoleName) =>
      userRoles.some((userRole) => userRole.name === allewedRoleName)
    );
    if (matchingRoles && matchingRoles.length) {
      return true;
    }
  }
}
