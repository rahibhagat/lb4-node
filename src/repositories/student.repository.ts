import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Student, StudentRelations, Department, Address, Permissions, UserPermissions} from '../models';
import {DepartmentRepository} from './department.repository';
import {AddressRepository} from './address.repository';
import {UserPermissionsRepository} from './user-permissions.repository';
import {PermissionsRepository} from './permissions.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly department: BelongsToAccessor<Department, typeof Student.prototype.id>;

  public readonly address: HasOneRepositoryFactory<Address, typeof Student.prototype.id>;

  public readonly permissions: HasManyThroughRepositoryFactory<Permissions, typeof Permissions.prototype.id,
          UserPermissions,
          typeof Student.prototype.id
        >;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource, @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>, @repository.getter('AddressRepository') protected addressRepositoryGetter: Getter<AddressRepository>, @repository.getter('UserPermissionsRepository') protected userPermissionsRepositoryGetter: Getter<UserPermissionsRepository>, @repository.getter('PermissionsRepository') protected permissionsRepositoryGetter: Getter<PermissionsRepository>,
  ) {
    super(Student, dataSource);
    this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', permissionsRepositoryGetter, userPermissionsRepositoryGetter,);
    this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
    this.address = this.createHasOneRepositoryFactoryFor('address', addressRepositoryGetter);
    this.registerInclusionResolver('address', this.address.inclusionResolver);
    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter,);
    this.registerInclusionResolver('department', this.department.inclusionResolver);
  }
}
