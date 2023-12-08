import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  PermissionsRepository,
  StudentRepository,
  UserPermissionsRepository,
} from '../repositories';

export interface UserInfo {
  user?: string;
}

export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(StudentRepository) public studentRepo: StudentRepository,
    @repository(UserPermissionsRepository)
    public userPermissions: UserPermissionsRepository,
    @repository(PermissionsRepository)
    public permissions: PermissionsRepository,
  ) {} // public permissionDataRepository: PermissionsDataRepository, // @repository(PermissionsDataRepository) // public permissionRepository: PermissionsRepository, // @repository(PermissionsRepository)

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const permissionType = metadata.resource;
    const permissionScope = metadata.scopes?.toString();
    const user = context.principals[0];
    const routePermission = await this.permissions.findOne({
      where: {
        name: permissionType,
      },
    });
    const allowedPermissions = await this.studentRepo
      .userPermissions(user.id)
      .find({
        where: {
          permissionsId: routePermission?.id,
        },
      });
    const isAllowed =
      allowedPermissions[0].permissionsId === routePermission?.id &&
      allowedPermissions[0].permission?.includes(permissionScope ?? '');
    return isAllowed ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }
}
