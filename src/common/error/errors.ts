import { HttpStatus } from '@nestjs/common';
import { BaseError } from './baseError';

export const ENTITY_NOT_FOUND = new BaseError(
  HttpStatus.NOT_FOUND,
  'Entity Not Found',
);

export const INVALID_DATA = new BaseError(
  HttpStatus.BAD_REQUEST,
  'Data is missing',
);

export const UNAUTHORIZED = new BaseError(
  HttpStatus.UNAUTHORIZED,
  'Unauthorized Request',
);

export const ENTITY_ALREADY_EXISTS = INVALID_DATA;
