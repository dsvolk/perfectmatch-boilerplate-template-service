import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '../config/config.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbIndicator: TypeOrmHealthIndicator,
    private httpIndicator: HttpHealthIndicator,
    private configService: ConfigService,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.dbIndicator.pingCheck('mongodb', { timeout: this.configService.dbHealthCheckTimeoutInMs }),
      // () => this.httpIndicator.pingCheck('conductor', `${this.configService.conductorURL}/health`),
      // () => this.microserviceIndicator.pingCheck('redis', {
      //   transport: Transport.REDIS,
      //   options: { host: this.configService.redisHost, port: this.configService.redisPort },
      //   }),
    ]);
  }
}
