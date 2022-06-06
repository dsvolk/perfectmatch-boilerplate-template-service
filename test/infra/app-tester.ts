import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { deepInspect } from '../../src/shared/utils/misc.utils';
import * as Helmet from 'helmet';

export class AppTester {
  private static _instance: AppTester;

  public static get instance(): AppTester {
    if (!this._instance) {
      throw new Error(`${AppTester.name}: cannot get instance: not instantiated`);
    }
    return this._instance;
  }

  private _scaffold: TestingModule;

  public get scaffold(): TestingModule {
    return this._scaffold;
  }

  private _app: INestApplication;

  public get app(): INestApplication {
    return this._app;
  }

  private _connection: Connection;

  public get connection(): Connection {
    return this._connection;
  }

  public static async create(): Promise<AppTester> {
    if (this._instance) {
      this.log('returning existing instance...');
      return this._instance;
    }

    this.log('creating new instance');
    const tester = new AppTester();
    AppTester._instance = tester;

    return await tester.init();
  }

  private static log(message: any, context: string = AppTester.name) {
    if (process.env.LOG_LEVEL === 'verbose') {
      console.log(`[${context}]:`, deepInspect(message));
      return;
    }

    if (process.env.LOG_LEVEL !== 'none') {
      console.log(`[${context}]:`, message);
      return;
    }
  }

  async teardown(): Promise<void> {
    AppTester.log('dropping db...');
    await this._connection.dropDatabase();
    AppTester.log('closing app...');
    await this._app.close();
    this._connection = undefined;
    this._app = undefined;
    this._scaffold = undefined;
    AppTester._instance = undefined;
    AppTester.log('teardown complete');
  }

  private async init(): Promise<AppTester> {
    // Init entire app
    AppTester.log('creating scaffold...');
    this._scaffold = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    AppTester.log('creating app...');
    this._app = this._scaffold.createNestApplication();

    this._app.use(Helmet());
    this._app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: false,
        whitelist: true,
        transform: true,
      }),
    );

    AppTester.log('initializing app...');
    await this._app.init();

    // manually protect local DB from mistakes
    if (process.env.NODE_ENV === 'test') {
      // get default db connection
      AppTester.log('getting db connection...');
      this._connection = await this.app.get(Connection);

      // clear and drop all collections and DBs of connection
      AppTester.log('synchronizing db...');
      await this._connection.synchronize(true);
    } else {
      throw new Error(
        `${AppTester.name}: Error parsing test environment: process.env.NODE_ENV= ${process.env.NODE_ENV}`,
      );
    }

    AppTester.log('init complete');
    return this;
  }
}
