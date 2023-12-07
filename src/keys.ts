import {BindingKey} from '@loopback/core';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'jwt-lb4';
  export const TOKEN_EXPIRES_IN_VALUE = 3600;
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
    'authentication.jwt.expiresIn',
  );
}
