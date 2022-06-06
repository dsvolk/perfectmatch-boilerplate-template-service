import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { Consts } from '../config/consts';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new AppLogger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.debug(
        `Response: ${userAgent} ${ip} - ${request.get(
          Consts.correlationIdHeaderName,
        )} - ${method} ${originalUrl} ${statusCode} ${contentLength}`,
      );
    });

    next();
  }
}
