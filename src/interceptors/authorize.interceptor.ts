import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Permissions} from '../models';
import {StudentRepository} from '../repositories';

export interface UserInfo {
  user?: string;
}

export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor(
    @repository(StudentRepository) public studentRepo: StudentRepository,
  ) {} // public permissionDataRepository: PermissionsDataRepository, // @repository(PermissionsDataRepository) // public permissionRepository: PermissionsRepository, // @repository(PermissionsRepository)

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    //debugger;

    // Check for the resource - Testing only for MedicalDocuments as of Now
    // if (
    //   metadata.resource == PermissionKeys.MedicalDocuments ||
    //   metadata.resource == PermissionKeys.Reports ||
    //   metadata.resource == PermissionKeys.Surgeries ||
    //   metadata.resource == PermissionKeys.Insurance ||
    //   metadata.resource == PermissionKeys.Allergies ||
    //   metadata.resource == PermissionKeys.FinancialDocuments
    // ) {
    //   let hasPermission = false;

    //   // Check/extract for the resource
    //   const resource = metadata.resource;

    //   // Get the Permission data id
    //   const permissionsDataForResource =
    //     await this.permissionDataRepository.find({
    //       where: {permKey: resource},
    //     });

    //   // Extract the logged in User id
    //   // This will be required for all the Authorization requests
    //   // Can be moved out
    //   const loggedinUser = _.pick<userInfo>(
    //     context.invocationContext.target,
    //     'user',
    //   );
    //   const UserId = loggedinUser.user;
    //   const PatientUserid = context.invocationContext.args[0];

    //   if (UserId === PatientUserid) {
    //     hasPermission = true; // No need to check rights as the userId and patientId are same.
    //   }

    //   // Check for Write - Rights
    //   else if (metadata.scopes?.find(x => x.includes(RightsKeys.Write))) {
    //     // Get the permissions assigned to the logged in user
    //     hasPermission = await this.checkForRights(
    //       UserId?.toString(),
    //       PatientUserid,
    //       permissionsDataForResource[0].id,
    //       RightsKeys.Write,
    //     );
    //   } else if (metadata.scopes?.find(x => x.includes(RightsKeys.Read))) {
    //     // Get the permissions assigned to the logged in user
    //     hasPermission = await this.checkForRights(
    //       UserId?.toString(),
    //       PatientUserid,
    //       permissionsDataForResource[0].id,
    //       RightsKeys.Read,
    //     );
    //   } else {
    //     hasPermission = false;
    //   }

    //   // Implement your logic to check if the user has the required permission
    //   // You can access the current user and request information from the context
    //   // Use metadata.resource to check the requested resource, if needed
    //   // Return AuthorizationDecision.ALLOW or AuthorizationDecision.DENY based on the permission check

    //   return hasPermission
    //     ? AuthorizationDecision.ALLOW
    //     : AuthorizationDecision.DENY;
    // }
    console.log('metadata.resource', metadata.resource);
    console.log('metadata.scopes', metadata.scopes);
    console.log('context', context.principals);
    const permissionType = metadata.resource;
    const user = context.principals[0];
    const permissions = await this.studentRepo.permissions(user.id).find();
    const isAllowed =
      permissions.filter((item: Permissions) => item.name === permissionType)
        .length > 0;
    return isAllowed ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }

  // async checkForRights(
  //   loggedInUserId: string | undefined,
  //   patientUserId: string,
  //   permissionId: number | undefined,
  //   permission: string,
  // ): Promise<boolean> {
  //   let hasRights = false;
  //   // Get the permissions assigned to the logged in user
  //   const permissionsForLoggedInUser = await this.permissionRepository.find({
  //     where: {
  //       and: [
  //         {permUserId: loggedInUserId},
  //         {patientUserId: patientUserId},
  //         {permissionId: permissionId},
  //       ],
  //     },
  //   });

  //   // This cannot be sent in the filter for the repository as the DB has a
  //   // unique constraint on patientUserId, PermUserId and Permission
  //   // so the record in db will be
  //   //     PatientUserId              ||        PermUserId              ||  Permissions
  //   // auth0|62781f02cfc4810067c2a24e || auth0|63f6e30a30b2d774b88d9b4d || read | write
  //   if (
  //     permissionsForLoggedInUser.filter(x => x.permission.includes(permission))
  //       .length > 0
  //   ) {
  //     hasRights = true;
  //   }
  //   return hasRights;
  // }
}
