import {Entity, belongsTo, hasOne, model, property, hasMany} from '@loopback/repository';
import {Address} from './address.model';
import {Department} from './department.model';
import {Permissions} from './permissions.model';
import {UserPermissions} from './user-permissions.model';

@model()
export class Student extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 15,
      minLength: 4,
    },
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;

  @property({
    type: 'number',
  })
  courseId?: number;

  @belongsTo(() => Department)
  departmentId: number;

  @hasOne(() => Address)
  address: Address;

  @hasMany(() => Permissions, {through: {model: () => UserPermissions}})
  permissions: Permissions[];

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

@model()
export class Login extends Entity {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;

  constructor(data?: Partial<Login>) {
    super(data);
  }
}

@model()
export class LoginRes extends Entity {
  @property({
    type: 'string',
  })
  token: string;

  constructor(data?: Partial<LoginRes>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
