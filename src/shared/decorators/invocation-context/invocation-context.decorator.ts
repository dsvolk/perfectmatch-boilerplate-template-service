import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InvocationContextType } from '../../api-communication-manager/enums/context-type.enum';
import { Consts } from '../../config/consts';
import { InvocationContextUtil } from '../invocation-context.util';

export const Ictx = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return InvocationContextUtil.createInvocationContext(
    InvocationContextType.Consumer,
    request.headers[Consts.correlationIdHeaderName],
  );
});
