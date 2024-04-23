import { HttpStatus } from '@nestjs/common';
import { TokenType } from '../exception/auth.exception';

/**
 * 공통 에러 객체
 */
export class BaseError {
  protected readonly _status: HttpStatus;
  protected _message: string;

  constructor(status: HttpStatus, message: string) {
    this._status = status;
    this._message = message;
  }

  set message(message) {
    this._message = message;
  }

  get status() {
    return this._status;
  }

  get message() {
    return this._message;
  }
}

export class AuthError extends BaseError {
  private _tokenType: TokenType;

  constructor(message: string, tokenType: TokenType = 'access') {
    super(HttpStatus.UNAUTHORIZED, message);
    this._tokenType = tokenType;
  }

  get tokenType() {
    return this._tokenType;
  }

  set tokenType(tokenType) {
    this._tokenType = tokenType;
  }
}
