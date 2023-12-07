import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {UserPermissions, UserPermissionsRelations} from '../models';

export class UserPermissionsRepository extends DefaultCrudRepository<
  UserPermissions,
  typeof UserPermissions.prototype.id,
  UserPermissionsRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(UserPermissions, dataSource);
  }
}
