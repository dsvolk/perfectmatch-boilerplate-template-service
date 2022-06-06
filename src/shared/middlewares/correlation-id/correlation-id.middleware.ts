import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../config/config.service';
import { Consts } from '../../config/consts';
import { CorrelationIdUtils } from './correlation-id.utils';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: Function) {
    let correlationId = req.get(Consts.correlationIdHeaderName);
    if (!correlationId) {
      correlationId = CorrelationIdUtils.generateCorrelationId(this.configService.correlationIdCreatedPrefix);
      req.headers[Consts.correlationIdHeaderName] = correlationId;
    }
    next();
  }
}
