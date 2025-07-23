import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: res,
        };
      } else if (typeof res === 'object') {
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          ...res,
        };
      }
    } else if (typeof exception === 'object' && exception !== null && 'message' in exception) {
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: (exception as any).message,
      };
    }

    response.status(status).json(errorResponse);
  }
}
