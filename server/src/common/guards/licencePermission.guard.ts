import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema'
import { Permission, plantEnum } from './role.enum';
import { tenant, users, subscriptionPlan } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const PERMISSION_KEYS = 'permissions';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEYS, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>
  ) { }

  async canActivate(
    context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermissions = this.reflector.get<Permission[]>('permissions', context.getHandler());
      if (!requiredPermissions) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const tenantId = request.user.tenantId;
      if (!user) {
        throw new ForbiddenException('Access denied: No permissions found');
      }
      if (user.role !== 'gadmin') {
        if (requiredPermissions[0].startsWith('read')) {
          const query = request.query
          console.log(query.tenantId, tenantId)
     //     if (+tenantId !== +query.tenantId) {
   //         throw new ForbiddenException('Access denied Permission not granted for this user');
        //  }
       //   else {
            return true;
       //   }
        }
        else {
          const query = request.body
          console.log(+tenantId, +query.tenantId)
          if (+tenantId !== +query.tenantId) {
            throw new ForbiddenException('Access denied: Permission not granted for this user');
          }
          else {
            const tenantItem = await this.db.query.tenant.findFirst({
              where: eq(tenant.id, query.tenantId),
              with: {
                licence: true,
                [requiredPermissions[0]]: true
              }
            })
            const subscriptionPlanItem = await this.db.query.subscriptionPlan.findFirst({
              where: eq(subscriptionPlan.id, tenantItem?.licence?.subscriptionPlanId),
            })

            const specs = subscriptionPlanItem?.specs ? JSON.parse(subscriptionPlanItem.specs) : {};
            const planKey = plantEnum[requiredPermissions[0]];
            const value = specs[planKey]?.value;
            if (value === undefined) {
              throw new ForbiddenException(`Permission value not defined for ${planKey}`);
            }
            if (tenantItem?.[requiredPermissions[0]].length >= value) {
              throw new ForbiddenException(`Permission denied: Can't create more than ${value}`);
            }
            else {
              return true;
            }
          }
        }
      }
      else {
        return true;
      }
    } catch (error) {
      console.log(error)
      throw new ForbiddenException(`${error}`);
    }

  }
}



