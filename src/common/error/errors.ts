import { HttpStatus } from '@nestjs/common';
import { AuthError, BaseError } from './baseError';

export const ENTITY_NOT_FOUND = new BaseError(
  HttpStatus.NOT_FOUND,
  'Entity Not Found',
);

export const INVALID_DATA = new BaseError(
  HttpStatus.BAD_REQUEST,
  'Data is missing',
);

export const UNAUTHORIZED = new AuthError('Unauthorized');

export const INTERNAL_SERVER_ERROR = new BaseError(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Server Error',
);

export const ENTITY_ALREADY_EXISTS = INVALID_DATA;
