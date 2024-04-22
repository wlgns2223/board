import { BaseError } from '../error/baseError';
import { UNAUTHORIZED } from '../error/errors';
import { ServiceException } from './serviceException';

export class AuthServiceException extends ServiceException {
  constructor(error: BaseError, message?: string) {
    super(error, message);
  }
}

export const TokenException = (message?: string) => {
  return new AuthServiceException(UNAUTHORIZED, message);
};
