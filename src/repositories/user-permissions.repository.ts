import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {UserPermissions, UserPermissionsRelations, Permissions} from '../models';
import {PermissionsRepository} from './permissions.repository';

export class UserPermissionsRepository extends DefaultCrudRepository<
  UserPermissions,
  typeof UserPermissions.prototype.id,
  UserPermissionsRelations
> {

  public readonly permissions: BelongsToAccessor<Permissions, typeof UserPermissions.prototype.id>;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource, @repository.getter('PermissionsRepository') protected permissionsRepositoryGetter: Getter<PermissionsRepository>,
  ) {
    super(UserPermissions, dataSource);
    this.permissions = this.createBelongsToAccessorFor('permissions', permissionsRepositoryGetter,);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
  }
}
