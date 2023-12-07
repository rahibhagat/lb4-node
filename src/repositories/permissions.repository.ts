import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Permissions, PermissionsRelations} from '../models';

export class PermissionsRepository extends DefaultCrudRepository<
  Permissions,
  typeof Permissions.prototype.id,
  PermissionsRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Permissions, dataSource);
  }
}
