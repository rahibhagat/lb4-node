import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {PermissionKeys, RightsKeys} from '../authorization/permission-keys';
import {Course} from '../models';
import {CourseRepository} from '../repositories';

export class CourseController {
  constructor(
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) {}

  @authenticate('jwt')
  @authorize({
    resource: PermissionKeys.Course,
    scopes: [RightsKeys.Edit],
  })
  @post('/courses')
  @response(200, {
    description: 'Course model instance',
    content: {'application/json': {schema: getModelSchemaRef(Course)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {
            title: 'NewCourse',
          }),
        },
      },
    })
    course: Course,
  ): Promise<Course> {
    return this.courseRepository.create(course);
  }

  @get('/courses/count')
  @response(200, {
    description: 'Course model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Course) where?: Where<Course>): Promise<Count> {
    return this.courseRepository.count(where);
  }

  @get('/courses')
  @response(200, {
    description: 'Array of Course model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Course, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Course) filter?: Filter<Course>): Promise<Course[]> {
    return this.courseRepository.find(filter);
  }

  @patch('/courses')
  @response(200, {
    description: 'Course PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        },
      },
    })
    course: Course,
    @param.where(Course) where?: Where<Course>,
  ): Promise<Count> {
    return this.courseRepository.updateAll(course, where);
  }

  @get('/courses/{id}')
  @response(200, {
    description: 'Course model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Course, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Course, {exclude: 'where'})
    filter?: FilterExcludingWhere<Course>,
  ): Promise<Course> {
    return this.courseRepository.findById(id, filter);
  }

  @patch('/courses/{id}')
  @response(204, {
    description: 'Course PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        },
      },
    })
    course: Course,
  ): Promise<void> {
    await this.courseRepository.updateById(id, course);
  }

  @put('/courses/{id}')
  @response(204, {
    description: 'Course PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() course: Course,
  ): Promise<void> {
    await this.courseRepository.replaceById(id, course);
  }

  @del('/courses/{id}')
  @response(204, {
    description: 'Course DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.courseRepository.deleteById(id);
  }
}
