import { InvocationContextType } from '../api-communication-manager/enums/context-type.enum';
import { InvocationContext } from '../interfaces/invocation-context.interface';
import { Consts } from '../config/consts';

export const InvocationContextUtil = {
  createInvocationContext(contextType: InvocationContextType, correlationId: string): InvocationContext {
    return {
      contextType: contextType,
      correlationId: correlationId,
    };
  },
  createInvocationContextFromRequest(request: Request): InvocationContext {
    if (!request) {
      return null;
    }
    return InvocationContextUtil.createInvocationContext(
      InvocationContextType.Consumer,
      request.headers[Consts.correlationIdHeaderName],
    );
  },
};
