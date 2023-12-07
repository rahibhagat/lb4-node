import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  getModelSchemaRef,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {TokenServiceBindings} from '../keys';
import {Login, LoginRes, Student} from '../models';
import {StudentRepository} from '../repositories';
import {MyUserService} from '../services';

export class LoginController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
    @service(MyUserService) public userSerive: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    public readonly jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public readonly jwtExpiresIn: string,
  ) {}

  @post('/login')
  @response(200, {
    description: 'Student model instance',
    content: {'application/json': {schema: getModelSchemaRef(Student)}},
  })
  async login(@requestBody() dto: Login): Promise<LoginRes> {
    return this.userSerive.verifyCredentials(dto).then(user => {
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            password: user.password,
          },
          this.jwtSecret,
          {
            expiresIn: this.jwtExpiresIn,
          },
        );
        const returnValue = new LoginRes();
        returnValue.token = token;
        return returnValue;
      }
      throw new HttpErrors.NotFound();
    });
    // const foundUser = await this.userSerive.verifyCredentials(dto);
    // const token = jwt.sign(
    //   {
    //     email: foundUser.email,
    //     password: foundUser.password,
    //   },
    //   jwtConfig.secret,
    //   {
    //     expiresIn: jwtConfig.expiresIn,
    //     audience: jwtConfig.audience,
    //     //algorithm: jwtConfig.algorithm
    //   },
    // );
    // return {token: token};
  }
}
