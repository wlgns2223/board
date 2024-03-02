import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseError } from '../error/baseError';
import {
  ENTITY_ALREADY_EXISTS,
  ENTITY_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  INVALID_DATA,
  UNAUTHORIZED,
} from '../error/errors';

/**
 * 발생시킬 Custom Exception
 */
export class ServiceException extends HttpException {
  private readonly _error: BaseError;
  private constructor(error: BaseError, message?: string) {
    super(message, error.status);
    error.message = message;
    this._error = error;
  }

  static of(error: BaseError, message?: string) {
    return new ServiceException(error, message);
  }

  get error() {
    return this._error;
  }
}

export const EntityNotFoundException = (message?: string) => {
  return ServiceException.of(ENTITY_NOT_FOUND, message);
};

export const MissingDataException = (message?: string) => {
  return ServiceException.of(INVALID_DATA, message);
};

export const EntityAlreadyExistsException = (message?: string) => {
  return ServiceException.of(ENTITY_ALREADY_EXISTS, message);
};

export const UnmatchedPassword = (message?: string) => {
  return ServiceException.of(UNAUTHORIZED, message);
};

export const TokenException = (message?: string) => {
  return ServiceException.of(UNAUTHORIZED, message);
};

export const InternalServerException = (message?: string) => {
  return ServiceException.of(INTERNAL_SERVER_ERROR, message);
};

// 에러 클래스를 정의하고 그 에러를 가지는 커스텀 예외를 던진다
// 커스텀 예외를 잡는 커스텀 예외 필터에서 , 던진 예외를 잡고
// 에러객체를 꺼내서 dealing !
