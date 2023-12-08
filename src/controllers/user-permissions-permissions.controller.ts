import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserPermissions,
  Permissions,
} from '../models';
import {UserPermissionsRepository} from '../repositories';

export class UserPermissionsPermissionsController {
  constructor(
    @repository(UserPermissionsRepository)
    public userPermissionsRepository: UserPermissionsRepository,
  ) { }

  @get('/user-permissions/{id}/permissions', {
    responses: {
      '200': {
        description: 'Permissions belonging to UserPermissions',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Permissions),
          },
        },
      },
    },
  })
  async getPermissions(
    @param.path.number('id') id: typeof UserPermissions.prototype.id,
  ): Promise<Permissions> {
    return this.userPermissionsRepository.permissions(id);
  }
}
