import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Student,
  UserPermissions,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentUserPermissionsController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/user-permissions', {
    responses: {
      '200': {
        description: 'Array of Student has many UserPermissions',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserPermissions)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<UserPermissions>,
  ): Promise<UserPermissions[]> {
    return this.studentRepository.userPermissions(id).find(filter);
  }

  @post('/students/{id}/user-permissions', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserPermissions)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserPermissions, {
            title: 'NewUserPermissionsInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) userPermissions: Omit<UserPermissions, 'id'>,
  ): Promise<UserPermissions> {
    return this.studentRepository.userPermissions(id).create(userPermissions);
  }

  @patch('/students/{id}/user-permissions', {
    responses: {
      '200': {
        description: 'Student.UserPermissions PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserPermissions, {partial: true}),
        },
      },
    })
    userPermissions: Partial<UserPermissions>,
    @param.query.object('where', getWhereSchemaFor(UserPermissions)) where?: Where<UserPermissions>,
  ): Promise<Count> {
    return this.studentRepository.userPermissions(id).patch(userPermissions, where);
  }

  @del('/students/{id}/user-permissions', {
    responses: {
      '200': {
        description: 'Student.UserPermissions DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(UserPermissions)) where?: Where<UserPermissions>,
  ): Promise<Count> {
    return this.studentRepository.userPermissions(id).delete(where);
  }
}
