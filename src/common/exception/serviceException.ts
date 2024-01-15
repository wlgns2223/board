import { BaseError, ENTITY_NOT_FOUND } from '../error/baseError';

export class ServiceException extends Error {
  private readonly _error: BaseError;
  private constructor(error: BaseError, message?: string) {
    super(!!message ? message : error.message);
    this._error = error;
  }

  static of(error: BaseError, message?: string) {
    return new ServiceException(error, message);
  }
}

export const EntityNotFoundException = (message?: string) => {
  return ServiceException.of(ENTITY_NOT_FOUND, message);
};
