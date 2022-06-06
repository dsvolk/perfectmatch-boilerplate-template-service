import { Message } from 'kafkajs';
import { InvocationContext } from '../../interfaces/invocation-context.interface';

const SOMETHING_HAPPENED_EVENT_TYPE = 'SomethingHappened';

class EventPayload {
  accountId: string;

  constructor(eventPayload?: EventPayload) {
    Object.assign(this, eventPayload);
  }
}

export class SomethingHappenedMessage {
  public static getMessage(userOnboardingId: string, accountId: string, ctx: InvocationContext): Message {
    return {
      key: userOnboardingId,
      value: JSON.stringify(new EventPayload({ accountId })),
      headers: {
        ...ctx,
        eventType: SOMETHING_HAPPENED_EVENT_TYPE,
      },
    };
  }
}
