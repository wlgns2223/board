import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';
import { ServiceException } from '../exception/serviceException';
import { AuthServiceException } from '../exception/auth.exception';
import { error } from 'console';

type ExceptionBody = {
  statusCode?: number | HttpStatus;
  message?: string;
  path?: string;
};

@Catch(ServiceException)
export class ServiceExceptionHttpFilter implements ExceptionFilter {
  private log: Logger = new Logger(ServiceException.name);
  private _request: Request;
  private _response: Response;
  private _exception: ServiceException;

  private setRequest(request: Request) {
    this._request = request;
  }

  private setResponse(response: Response) {
    this._response = response;
  }

  private setException(exception: ServiceException) {
    this._exception = exception;
  }

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.setRequest(request);
    this.setResponse(response);
    this.setException(exception);
    this.logException();

    return this.handleResponse();
  }

  private logException() {
    this.log.error(this._exception.stack);
  }

  private handleResponse() {
    switch (this._exception.constructor) {
      case AuthServiceException:
        return this.handleAuthServiceException();

      default:
        return this.handleGeneralException();
    }
  }

  private handleAuthServiceException() {
    const headerName = 'WWW-Authenticate';
    const headerBody = `Bearer realm="ACCESS_TOKEN",error=${
      this._exception.message
    },errorDescription=${JSON.stringify(this._exception.cause)}`;
    return this._response
      .status(this._exception.error.status)
      .header(headerName, headerBody)
      .json({
        statusCode: this._exception.error.status,
        message: this._exception.error.message,
        path: this._request.url,
      } as ExceptionBody);
  }

  private handleGeneralException() {
    return this._response.status(this._exception.error.status).json({
      statusCode: this._exception.error.status,
      message: this._exception.error.message,
      path: this._request.url,
    } as ExceptionBody);
  }
}
