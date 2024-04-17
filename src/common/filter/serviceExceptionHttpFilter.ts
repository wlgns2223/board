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
import { AuthException, ServiceException } from '../exception/serviceException';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';

type ExceptionBody = {
  statusCode?: number | HttpStatus;
  message?: string;
  path?: string;
};

@Catch(ServiceException)
@Injectable()
export class ServiceExceptionHttpFilter
  implements ExceptionFilter, OnModuleInit
{
  private log: Logger = new Logger(ServiceException.name);
  private tokenService?: AuthService;
  private _request: Request;
  private _response: Response;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.tokenService = this.moduleRef.get(AuthService, { strict: false });
  }

  private setRequest(request: Request) {
    this._request = request;
  }

  private setResponse(response: Response) {
    this._response = response;
  }

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.setRequest(request);
    this.setResponse(response);

    const status = exception.error.status;

    this.log.error(exception.stack);

    return response.status(status).json({
      statusCode: status,
      message: exception?.error.message || 'no message',
      path: request.url,
    } as ExceptionBody);
  }

  private async handleException(exception: ServiceException) {
    switch (exception.constructor) {
      case AuthException:
        return '';
    }
  }

  private response(param: Pick<ExceptionBody, 'statusCode' | 'message'>) {
    const json: ExceptionBody = {
      ...param,
      path: this._request.url,
    };
    return this._response.status(param.statusCode).json(json);
  }
}
