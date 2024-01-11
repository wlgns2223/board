import { HttpStatus } from '@nestjs/common';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { stat } from 'fs';

export class BaseResponse<T> {
  @Exclude() private _status: HttpStatus = HttpStatus.OK;
  @Exclude() private _data: T | null = null;
  @Exclude() private _message: string = '';

  constructor(param?: { status: HttpStatus; data: T; message: string }) {
    if (param) {
      this._status = param.status;
      this._data = param.data;
      this._message = param.message;
    }
  }

  onSuccess(data: T, code: HttpStatus = HttpStatus.OK) {
    this._data = data;
    this._status = code;
  }

  onError(message: string, code: HttpStatus) {
    this._data = null;
    this._message = message;
    this._status = code;
  }

  serialize() {
    return instanceToPlain(this);
  }

  @Expose()
  get status() {
    return this._status;
  }

  @Expose()
  get message() {
    return this._message;
  }

  @Expose()
  get data() {
    return this._data;
  }
}
