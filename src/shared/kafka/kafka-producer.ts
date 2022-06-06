import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppLogger } from '@talent-fabric/nestjs-logger';
import { Kafka, Message, Producer } from 'kafkajs';
import { deepInspect, isTest } from '../utils/misc.utils';
import { InvocationContext } from '../interfaces/invocation-context.interface';
import { ConfigService } from '../config/config.service';
import { KafkaProduceError } from '../exceptions/errors/kafka-produce.error';

const CLIENT_ID = 'onboarding_service_kafka_producer';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private readonly logger = new AppLogger(KafkaProducer.name);
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Init');
  }

  async onModuleInit(): Promise<void> {
    if (isTest()) return this.logger.verbose('Disabled while testing');

    this.producer = new Kafka({
      clientId: CLIENT_ID,
      brokers: [this.configService.kafkaBroker],
      ssl: true,
      sasl: {
        mechanism: 'plain', // scram-sha-256 or scram-sha-512
        username: this.configService.kafkaUsername,
        password: this.configService.kafkaPassword,
      },
    }).producer({
      allowAutoTopicCreation: false,
    });

    await this.producer.connect();
  }

  public async sendMessages(ctx: InvocationContext, topic: string, messages: Message[]): Promise<string | void> {
    if (isTest()) return this.logger.verbose('Disabled while testing');

    this.logger.debug('Sending messages', ctx, { topic: topic, payload: deepInspect(messages, 3) });
    try {
      await this.producer.send({ topic, messages });
    } catch (e) {
      return this.handleError(ctx, e);
    }
  }

  private handleError(ctx: InvocationContext, e: any): void {
    const message = e?.originalError ? `${e.originalError.type}:${e?.toString()}` : `${e?.name}:${e?.toString()}`;
    throw new KafkaProduceError(ctx, {
      originalErrorMessage: message,
    });
  }
}
