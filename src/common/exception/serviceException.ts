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
 * 블로그 참고할때에는 Exception이 프로토콜과 관계 없이 사용하도록 Error 클래스를 상속받도록 했지만
 * 나는 학습목적이므로 HttpException을 상속받도록 했다.
 * 현재 내가 하려는 프로젝트에서는 HTTP 프로토콜만을 사용한다.
 */

/**
 * 발생시킬 Custom Exception
 */

export class ServiceException extends HttpException {
  private readonly _error: BaseError;
  constructor(error: BaseError, message?: string) {
    super(message, error.status);
    error.message = message;
    this._error = error;
  }

  get error() {
    return this._error;
  }
}

export class AuthException extends ServiceException {
  constructor(error: BaseError, message?: string) {
    super(error, message);
  }
}

export const EntityNotFoundException = (message?: string) => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
};

export const MissingDataException = (message?: string) => {
  return new ServiceException(INVALID_DATA, message);
};

export const EntityAlreadyExistsException = (message?: string) => {
  return new ServiceException(ENTITY_ALREADY_EXISTS, message);
};

export const UnmatchedPassword = (message?: string) => {
  return new ServiceException(UNAUTHORIZED, message);
};

export const TokenException = (message?: string) => {
  return new AuthException(UNAUTHORIZED, message);
};

export const InternalServerException = (message?: string) => {
  return new ServiceException(INTERNAL_SERVER_ERROR, message);
};

// 에러 클래스를 정의하고 그 에러를 가지는 커스텀 예외를 던진다
// 커스텀 예외를 잡는 커스텀 예외 필터에서 , 던진 예외를 잡고
// 에러객체를 꺼내서 dealing !
