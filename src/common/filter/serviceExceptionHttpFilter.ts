import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceException } from '../exception/serviceException';

type ExceptionBody = {
  statusCode?: string | HttpStatus;
  message?: string;
  path?: string;
};

@Catch(ServiceException)
export class ServiceExceptionHttpFilter implements ExceptionFilter {
  private log: Logger = new Logger(ServiceException.name);

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.error.status;

    this.log.error(exception.stack);

    return response.status(status).json({
      statusCode: status,
      message: exception?.error.message || 'no message',
      path: request.url,
    } as ExceptionBody);
  }
}
