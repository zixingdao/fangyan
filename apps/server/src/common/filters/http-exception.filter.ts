import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let message =
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? (exceptionResponse as any).message
        : exceptionResponse;

    // Handle Zod Validation Errors (nestjs-zod throws UnprocessableEntityException with a specific format)
    // Extract detailed errors if available
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      // Check for 'errors' field which typically contains Zod issues
      if ('errors' in exceptionResponse) {
        const errors = (exceptionResponse as any).errors;
        if (Array.isArray(errors)) {
           // Format Zod errors: "path: message"
           const details = errors.map((e: any) => {
             const path = e.path ? e.path.join('.') : '';
             return path ? `${path}: ${e.message}` : e.message;
           }).join('; ');
           message = `${message} (${details})`;
        }
      }
    }

    // Log error if internal
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    response.status(status).json({
      code: status,
      data: null,
      msg: Array.isArray(message) ? message.join(', ') : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
