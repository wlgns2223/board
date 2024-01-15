import { HttpStatus } from '@nestjs/common';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';

export class BaseResponse<T> {
  @Exclude() private _data: T | null = null;

  private constructor(data: T) {
    this._data = data;
  }

  @Expose()
  get data() {
    return this._data;
  }
  static of<T>(data: T) {
    return instanceToPlain(new BaseResponse<T>(data));
  }
}
