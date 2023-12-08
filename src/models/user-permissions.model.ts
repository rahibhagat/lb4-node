import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Permissions} from './permissions.model';

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
    type: 'string',
  })
  permission?: string;

  @belongsTo(() => Permissions)
  permissionsId: number;

  constructor(data?: Partial<UserPermissions>) {
    super(data);
  }
}

export interface UserPermissionsRelations {
  // describe navigational properties here
}

export type UserPermissionsWithRelations = UserPermissions &
  UserPermissionsRelations;
