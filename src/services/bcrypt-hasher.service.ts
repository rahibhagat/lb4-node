import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {compareSync, genSalt, hash} from 'bcryptjs';

@injectable({scope: BindingScope.TRANSIENT})
export class BcryptHasherService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  private round: number = 10;
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.round);
    return hash(password, salt);
  }

  validatePassword(password: string, dbPassword: string): boolean {
    const isValidate = compareSync(password, dbPassword);
    return isValidate;
  }
}
