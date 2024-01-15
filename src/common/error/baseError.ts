import { HttpStatus } from '@nestjs/common';

export class BaseError {
  protected readonly _status: HttpStatus;
  protected readonly _message: string;

  constructor(status: HttpStatus, message: string) {
    this._status = status;
    this._message = message;
  }

  get status() {
    return this._status;
  }

  get message() {
    return this._message;
  }
}

export const ENTITY_NOT_FOUND = new BaseError(
  HttpStatus.NOT_FOUND,
  'Entity Not Found',
);
