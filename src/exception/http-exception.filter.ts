import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { formatTime } from '@/utils/formatTime.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    // Xử lý message: Nó có thể là string hoặc object (nếu validation lỗi trả về array)
    const message = typeof exceptionResponse === 'object' && exceptionResponse.message 
        ? exceptionResponse.message 
        : exceptionResponse;

    // Trả về format đồng nhất với Interceptor hôm qua
    response.status(status).json({
      statusCode: status,
      message: message, // Lấy message lỗi
      data: null, // Data lỗi thì null
      path: request.url, // (Optional) Gửi kèm đường dẫn bị lỗi để dễ debug
      timestamp: formatTime(new Date(), 7),
    });
  }
}