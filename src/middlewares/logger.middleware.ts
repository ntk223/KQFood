import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Tạo logger với context là 'HTTP' để dễ phân biệt trong console
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    // Lưu thời điểm bắt đầu để tính thời gian xử lý (Response Time)
    const start = Date.now();

    // Lắng nghe sự kiện khi response kết thúc
    res.on('finish', () => {
      const { statusCode } = res;
      // Lấy độ dài content (nếu có)
      const contentLength = res.get('content-length');
      
      // Tính toán thời gian chạy
      const duration = Date.now() - start;

      // Log ra console
      // Format: [METHOD] [URL] [STATUS] [SIZE] - [AGENT] [IP] [DURATION]
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} +${duration}ms`,
      );
    });

    next();
  }
}