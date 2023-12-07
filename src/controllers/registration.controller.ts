import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Student} from '../models';
import {StudentRepository} from '../repositories';
import {BcryptHasherService} from '../services';

export class RegistrationController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
    @service(BcryptHasherService)
    public bcryptHasherService: BcryptHasherService,
  ) {}

  @post('/register')
  @response(200, {
    description: 'Student model instance',
    content: {'application/json': {schema: getModelSchemaRef(Student)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudent',
          }),
        },
      },
    })
    student: Student,
  ): Promise<Student> {
    student.password = await this.bcryptHasherService.hashPassword(
      student.password,
    );
    return this.studentRepository.create(student);
  }
}
