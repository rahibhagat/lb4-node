import {Entity, model, property} from '@loopback/repository';

@model()
export class UserPermissions extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  studentId?: number;

  @property({
    type: 'number',
  })
  permissionsId?: number;

  @property({
    type: 'string',
  })
  permission?: string;

  constructor(data?: Partial<UserPermissions>) {
    super(data);
  }
}

export interface UserPermissionsRelations {
  // describe navigational properties here
}

export type UserPermissionsWithRelations = UserPermissions &
  UserPermissionsRelations;
