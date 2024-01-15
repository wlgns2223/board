import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceException } from '../exception/serviceException';

type ExceptionBody = {
  statusCode?: string;
  message?: string;
  path?: string;
};

@Catch(ServiceException)
export class ServiceExceptionHttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    return response.status(status).json({
      statusCode: status,
      message: exception?.message || 'no message',
      path: request.url,
    } as ExceptionBody);
  }
}
