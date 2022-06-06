import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Helmet from 'helmet';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { ConfigService } from './shared/config/config.service';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger('Bootstrap', false),
  });

  app.use(Helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );

  app.use(json({ limit: '30mb' }));

  const logger: AppLogger = new AppLogger('Bootstrap');

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
    ],
  });

  const config: ConfigService = app.get(ConfigService);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Onboarding Service API')
    .setDescription('API for Onboarding Service')
    .setVersion('1.0')
    .addServer(config.swaggerServer)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  const port = config.servicePort || 3000;
  await app.listen(port, () => {
    logger.log(`Service listening on port: ${port}`);
    logger.log(`Environment: ${config.nodeEnv}`);
  });
}

bootstrap();
