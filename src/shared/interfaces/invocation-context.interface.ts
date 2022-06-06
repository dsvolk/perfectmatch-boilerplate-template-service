import { InvocationContextType } from '../api-communication-manager/enums/context-type.enum';

export interface InvocationContext {
  contextType: InvocationContextType;
  correlationId: string;
}
