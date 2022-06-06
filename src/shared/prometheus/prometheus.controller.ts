import { Controller, Get, Header } from '@nestjs/common';
import * as PromClient from 'prom-client';
import { ConfigService } from '../config/config.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('metrics')
export class PrometheusController {
  constructor(private configService: ConfigService) {
    const register = PromClient.register;
    register.setDefaultLabels({
      app: configService.appNameInPrometheus,
    });
    PromClient.collectDefaultMetrics({ register });
  }

  @ApiExcludeEndpoint()
  @Get()
  @Header('Content-Type', PromClient.register.contentType)
  index() {
    return PromClient.register.metrics();
  }
}
