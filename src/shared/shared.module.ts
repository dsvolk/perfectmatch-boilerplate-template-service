import { Module } from '@nestjs/common';
import { TypeOrmSqlConfigService } from './database/type-orm-sql-config.service';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigService } from './config/config.service';
import { AxiosApiCommunicationService } from './api-communication-manager/services/axios-api-communication.service';
import { HealthController } from './health/health.controller';
import { PrometheusController } from './prometheus/prometheus.controller';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { HttpModule } from '@nestjs/axios';
import { API_COMMUNICATION_SERVICE } from './api-communication-manager/interfaces/api-communication-manager.interface';
import { KafkaProducer } from './kafka/kafka-producer';
import { PositionService } from './external-services/position-service/position.service';
import { DataPlatformApi } from './external-services/data-platform-api/data-platform-api';
import { CompanyAndInstitutionService } from './external-services/company-and-institution-service/company-and-institution.service';
import { AccountService } from './external-services/account-service/account.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController, PrometheusController],
  providers: [
    AppLogger,
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
    },
    TypeOrmSqlConfigService,
    {
      provide: API_COMMUNICATION_SERVICE,
      useClass: AxiosApiCommunicationService,
    },
    PositionService,
    AccountService,
    KafkaProducer,
    DataPlatformApi,
    CompanyAndInstitutionService,
  ],
  exports: [
    AppLogger,
    ConfigService,
    TypeOrmSqlConfigService,
    API_COMMUNICATION_SERVICE,
    PositionService,
    AccountService,
    KafkaProducer,
    DataPlatformApi,
    CompanyAndInstitutionService,
  ],
})
export class SharedModule {}
