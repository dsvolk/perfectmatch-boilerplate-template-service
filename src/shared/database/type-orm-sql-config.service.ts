import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { ReadPreference } from 'mongodb';

/**
 * Custom TypeOrmConfig service, to get configuration from our custom ConfigService
 */
@Injectable()
export class TypeOrmSqlConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new AppLogger(TypeOrmSqlConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Init');
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // DB type for some reason can't be dynamic. see here: https://github.com/typeorm/typeorm/issues/949
    let dbType;
    switch (this.configService.dbConnectionType) {
      case 'mysql':
        dbType = 'mysql';
        break;
      case 'postgres':
        dbType = 'postgres';
        break;
      case 'mongodb':
      case 'mongo':
        dbType = 'mongodb';
        return this.mongodbConnectionConfig(dbType);
      default:
        dbType = 'postgres';
    }

    return {
      type: dbType,
      // name: this.configService.dbConnectionName,
      host: this.configService.dbHost,
      port: this.configService.dbPort,
      database: this.configService.dbName,
      username: this.configService.dbUsername,
      password: this.configService.dbPassword,
      synchronize: false,
      logging: this.configService.dbQueryLogs,
      entities: [__dirname + '/../../**/*.entity.{js,ts}'],
      migrations: [__dirname + '/database/migration/*{.ts,.js}'],
      cli: {
        migrationsDir: 'src/database/migration',
      },
    };
  }

  private mongodbConnectionConfig(dbType): TypeOrmModuleOptions {
    return {
      type: dbType,
      url: this.configService.mongodbConnectionString,
      host: this.configService.dbHost,
      port: this.configService.dbPort,
      username: this.configService.dbUsername,
      password: this.configService.dbPassword,
      authSource: this.configService.dbAuthSource,
      database: this.configService.dbName,
      entities: [__dirname + '/../../**/*.entity.{js,ts}'],
      ssl: this.configService.dbSsl,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      readPreference: ReadPreference.NEAREST, // allows reading from replica set secondary shards
    };
  }
}
