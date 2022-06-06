import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { EnvironmentConfiguration } from './interfaces/config.interface';
import { Injectable } from '@nestjs/common';
import { parseBooleanFromStringValue } from '../utils/misc.utils';

/**
 * A custom configuration service.
 * Support configuration from file and from environment variables.
 */
@Injectable()
export class ConfigService {
  private readonly logger = new AppLogger(ConfigService.name);
  private readonly environmentConfiguration: EnvironmentConfiguration;

  constructor(filePath: string) {
    try {
      this.logger.log('Init');
      this.configureProcessExitCleanup();
      if (fs.existsSync(filePath)) {
        this.logger.log(`Retrieving configuration from ${filePath}`);
        this.environmentConfiguration = dotenv.parse(fs.readFileSync(filePath));
      } else {
        this.logger.log(`${filePath} doesn't exist. Retrieving configuration from environment variables`);
        this.environmentConfiguration = process.env;
      }
      this.validateConfig(this.environmentConfiguration);
      if (!!this.logLevel) {
        process.env.LOG_LEVEL = this.logLevel;
      }
    } catch (error) {
      this.logger.error('Error while loading app config', error);
      process.exit(1);
    }
  }

  get servicePort(): number {
    return Number(this.environmentConfiguration.SERVICE_PORT);
  }

  get requestTimeoutMs(): number {
    return Number(this.environmentConfiguration.REQUEST_TIMEOUT_MS) || 30_000;
  }

  get nodeEnv(): string {
    return this.environmentConfiguration.NODE_ENV;
  }

  get dbConnectionType(): string {
    return this.environmentConfiguration.DB_CONNECTION_TYPE;
  }

  get dbHost(): string {
    return this.environmentConfiguration.DB_HOST;
  }

  get dbPort(): number {
    return Number(this.environmentConfiguration.DB_PORT);
  }

  get dbName(): string {
    return this.environmentConfiguration.DB_NAME;
  }

  get dbUsername(): string {
    return this.environmentConfiguration.DB_USERNAME;
  }

  get dbPassword(): string {
    return this.environmentConfiguration.DB_PASSWORD;
  }

  get dbAuthSource(): string {
    return this.environmentConfiguration.DB_AUTH_SOURCE;
  }

  get dbQueryLogs(): boolean {
    return parseBooleanFromStringValue(this.environmentConfiguration.DB_QUERY_LOGS);
  }

  get dbSsl(): boolean {
    return parseBooleanFromStringValue(this.environmentConfiguration.DB_SSL);
  }

  get dbHealthCheckTimeoutInMs(): number {
    return Number(this.environmentConfiguration.DB_HEALTHCHECK_TIMEOUT_IN_MS) || 1000;
  }

  get mongodbConnectionString(): string {
    return this.environmentConfiguration.MONGO_CONNECTION_STRING;
  }

  get correlationIdCreatedPrefix(): string {
    return this.environmentConfiguration.CORRELATION_ID_CREATED_PREFIX;
  }

  get appNameInPrometheus(): string {
    return this.environmentConfiguration.APP_NAME_IN_PROMETHEUS;
  }

  get logLevel(): string {
    return this.environmentConfiguration.LOG_LEVEL;
  }

  get positionServiceUrl(): string {
    return this.environmentConfiguration.POSITION_SERVICE_URL;
  }

  get accountServiceUrl(): string {
    return this.environmentConfiguration.ACCOUNT_SERVICE_URL;
  }

  get kafkaBroker(): string {
    return this.environmentConfiguration.KAFKA_BROKER;
  }

  get kafkaUsername(): string {
    return this.environmentConfiguration.KAFKA_USERNAME;
  }

  get kafkaPassword(): string {
    return this.environmentConfiguration.KAFKA_PASSWORD;
  }

  get dataPlatformApiUrl(): string {
    return this.environmentConfiguration.DATA_PLATFORM_API_URL;
  }

  get swaggerServer(): string {
    return this.environmentConfiguration.SWAGGER_SERVER || '';
  }

  get companyServiceUrl(): string {
    return this.environmentConfiguration.COMPANY_AND_INSTITUTION_SERVICE_URL;
  }

  /**
   * Validates the configuration
   * @param envConfig The configuration to validate
   */
  private validateConfig(envConfig): void {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().required().valid('development', 'test', 'production'),
      SERVICE_PORT: Joi.number().required(),
      REQUEST_TIMEOUT_MS: Joi.number(),
      APP_NAME_IN_PROMETHEUS: Joi.string().required(),
      LOG_LEVEL: Joi.string().required(),
      DB_CONNECTION_TYPE: Joi.string().required().valid('postgres', 'mysql', 'mongodb'),
      DB_HOST: Joi.string(),
      DB_PORT: Joi.number(),
      DB_NAME: Joi.string(),
      DB_PASSWORD: Joi.string(),
      DB_AUTH_SOURCE: Joi.string().allow(null),
      DB_QUERY_LOGS: Joi.boolean().default(false),
      DB_SSL: Joi.boolean().default(false).allow('', null),
      DB_HEALTHCHECK_TIMEOUT_IN_MS: Joi.number(),
      MONGO_CONNECTION_STRING: Joi.string().allow(null, ''),
      CORRELATION_ID_CREATED_PREFIX: Joi.string().required(),
      POSITION_SERVICE_URL: Joi.string().required(),
      ACCOUNT_SERVICE_URL: Joi.string().required(),
      KAFKA_BROKER: Joi.string().required(),
      KAFKA_USERNAME: Joi.string().required(),
      KAFKA_PASSWORD: Joi.string().required(),
      DATA_PLATFORM_API_URL: Joi.string().required(),
      SWAGGER_SERVER: Joi.string().default('').allow('', null),
      COMPANY_AND_INSTITUTION_SERVICE_URL: Joi.string().required(),
    }).options({ allowUnknown: true });
    const { error } = envVarsSchema.validate(envConfig);
    if (error) {
      this.logger.error(`Configuration validation error: ${error.message}`, error);
      throw new Error(`Configuration validation error: ${error.message}`);
    }
  }

  private exitHandler(options, exitCode) {
    if (options.cleanup) console.log('cleanup');
    if (exitCode || exitCode === 0) console.error(`Terminating process. CODE=${exitCode}`);
    if (options.exit) process.exit();
  }

  private configureProcessExitCleanup() {
    process.stdin.resume(); //so the program will not close instantly

    //do something when app is closing
    process.on('exit', this.exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on('SIGINT', this.exitHandler.bind(null, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', this.exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', this.exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on('uncaughtException', this.exitHandler.bind(null, { exit: true }));
  }
}
