import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {
  Address,
  Department,
  Permissions,
  Student,
  StudentRelations,
  UserPermissions,
} from '../models';
import {AddressRepository} from './address.repository';
import {DepartmentRepository} from './department.repository';
import {PermissionsRepository} from './permissions.repository';
import {UserPermissionsRepository} from './user-permissions.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {
  public readonly department: BelongsToAccessor<
    Department,
    typeof Student.prototype.id
  >;

  public readonly address: HasOneRepositoryFactory<
    Address,
    typeof Student.prototype.id
  >;

  public readonly permissions: HasManyThroughRepositoryFactory<
    Permissions,
    typeof Permissions.prototype.id,
    UserPermissions,
    typeof Student.prototype.id
  >;

  public readonly userPermissions: HasManyRepositoryFactory<
    UserPermissions,
    typeof Student.prototype.id
  >;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
    @repository.getter('DepartmentRepository')
    protected departmentRepositoryGetter: Getter<DepartmentRepository>,
    @repository.getter('AddressRepository')
    protected addressRepositoryGetter: Getter<AddressRepository>,
    @repository.getter('UserPermissionsRepository')
    protected userPermissionsRepositoryGetter: Getter<UserPermissionsRepository>,
    @repository.getter('PermissionsRepository')
    protected permissionsRepositoryGetter: Getter<PermissionsRepository>,
  ) {
    super(Student, dataSource);
    this.userPermissions = this.createHasManyRepositoryFactoryFor(
      'userPermissions',
      userPermissionsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userPermissions',
      this.userPermissions.inclusionResolver,
    );
    this.address = this.createHasOneRepositoryFactoryFor(
      'address',
      addressRepositoryGetter,
    );
    this.registerInclusionResolver('address', this.address.inclusionResolver);
    this.department = this.createBelongsToAccessorFor(
      'department',
      departmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'department',
      this.department.inclusionResolver,
    );
  }
}
