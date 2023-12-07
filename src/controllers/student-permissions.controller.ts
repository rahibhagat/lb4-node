import {authenticate} from '@loopback/authentication';
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
import {Permissions, Student} from '../models';
import {StudentRepository} from '../repositories';

@authenticate('jwt')
export class StudentPermissionsController {
  constructor(
    @repository(StudentRepository)
    protected studentRepository: StudentRepository,
  ) {}

  @get('/students/{id}/permissions', {
    responses: {
      '200': {
        description:
          'Array of Student has many Permissions through UserPermissions',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Permissions)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Permissions>,
  ): Promise<Permissions[]> {
    return this.studentRepository.permissions(id).find(filter);
  }

  @post('/students/{id}/permissions', {
    responses: {
      '200': {
        description: 'create a Permissions model instance',
        content: {'application/json': {schema: getModelSchemaRef(Permissions)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {
            title: 'NewPermissionsInStudent',
            exclude: ['id'],
          }),
        },
      },
    })
    permissions: Omit<Permissions, 'id'>,
  ): Promise<Permissions> {
    return this.studentRepository.permissions(id).create(permissions);
  }

  @patch('/students/{id}/permissions', {
    responses: {
      '200': {
        description: 'Student.Permissions PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Permissions, {partial: true}),
        },
      },
    })
    permissions: Partial<Permissions>,
    @param.query.object('where', getWhereSchemaFor(Permissions))
    where?: Where<Permissions>,
  ): Promise<Count> {
    return this.studentRepository.permissions(id).patch(permissions, where);
  }

  @del('/students/{id}/permissions', {
    responses: {
      '200': {
        description: 'Student.Permissions DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Permissions))
    where?: Where<Permissions>,
  ): Promise<Count> {
    return this.studentRepository.permissions(id).delete(where);
  }
}
