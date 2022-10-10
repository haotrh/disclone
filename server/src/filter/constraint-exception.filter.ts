import { UniqueConstraintViolationException } from '@mikro-orm/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(UniqueConstraintViolationException)
export class ConstraintExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(exception: UniqueConstraintViolationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const url = request.originalUrl;
    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message;
    const error = exception.name;
    const errorResponse = {
      statusCode: status,
      message,
      error,
    };

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
    console.log(url, errorResponse);
  }
}
