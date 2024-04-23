import { AuthError, BaseError } from '../error/baseError';
import { UNAUTHORIZED } from '../error/errors';
import { ServiceException } from './serviceException';

export type TokenType = 'access' | 'refresh';

export class AuthServiceException extends ServiceException {
  constructor(tokenType: TokenType, error: AuthError, message?: string) {
    error.tokenType = tokenType;
    super(error, message);
  }
}

export const TokenException = (
  message?: string,
  tokenType: TokenType = 'access',
) => {
  return new AuthServiceException(tokenType, UNAUTHORIZED, message);
};
