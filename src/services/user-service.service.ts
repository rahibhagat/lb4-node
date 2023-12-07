import {UserService} from '@loopback/authentication';
import {Credentials} from '@loopback/authentication-jwt';
import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Student} from '../models';
import {StudentRepository} from '../repositories';
import {BcryptHasherService} from './bcrypt-hasher.service';

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserService implements UserService<Student, Credentials> {
  constructor(
    @repository(StudentRepository) public studentRepo: StudentRepository,
    @service(BcryptHasherService)
    public bcryptHasherService: BcryptHasherService,
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Student> {
    const foundUser = await this.studentRepo.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound('User is not exist!!');
    }
    const isValidPassword = this.bcryptHasherService.validatePassword(
      credentials.password,
      foundUser.password,
    );
    if (!isValidPassword) {
      throw new HttpErrors.Unauthorized('Password is not valid!!');
    }
    return foundUser;
  }
  convertToUserProfile(user: Student): UserProfile {
    throw new Error('Method not implemented.');
  }

  /*
   * Add service methods here
   */
}
