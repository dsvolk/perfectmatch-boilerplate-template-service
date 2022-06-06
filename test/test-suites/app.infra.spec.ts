import { AppTester } from '../infra/app-tester';
import { ConfigService } from '../../src/shared/config/config.service';
import { clearAllDbData } from '../infra/db.utils';

describe('Testing Infrastructure', () => {
  let tester: AppTester;

  beforeAll(async () => {
    tester = await AppTester.create();
  });

  beforeEach(async () => {
    await clearAllDbData();
  });

  it('Tester should be defined', async () => {
    expect(tester).toBeDefined();
  });

  it('Scaffold should be defined', async () => {
    expect(tester.scaffold).toBeDefined();
    expect(tester.scaffold.get<ConfigService>(ConfigService).nodeEnv).toEqual('test');
  });

  it('App should be defined', async () => {
    expect(tester.app).toBeDefined();
    expect(await tester.app.getHttpServer()).toBeDefined();
  });

  it('DB connection should be defined and active', async () => {
    expect(tester.connection).toBeDefined();
    expect(tester.connection.isConnected).toEqual(true);
  });

  afterAll(async () => {
    await tester.teardown();
  });
});
