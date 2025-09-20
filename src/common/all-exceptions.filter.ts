import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const errorResponse = exception.getResponse();
      return response.status(400).json({
        statusCode: 400,
        message: 'Validation failed',
        errors: errorResponse['message'] || errorResponse,
      });
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: exception.message || 'Internal server error',
    });
  }
}
