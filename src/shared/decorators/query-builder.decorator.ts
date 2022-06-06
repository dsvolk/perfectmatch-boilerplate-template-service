import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { QueryBuilder, QueryBuilderDbType } from '@talent-fabric/typeorm-express-query-builder';

export const SqlQueryBuilder = createParamDecorator((data: any, ctx: ExecutionContext) =>
  buildQuery(QueryBuilderDbType.Sql, ctx),
);

export const MongoDbQueryBuilder = createParamDecorator((data: any, ctx: ExecutionContext) =>
  buildQuery(QueryBuilderDbType.MongoDB, ctx),
);

const buildQuery = (queryBuilderDbType: QueryBuilderDbType, ctx: ExecutionContext): FindManyOptions => {
  const request = ctx.switchToHttp().getRequest();
  return new QueryBuilder(request.query, null, queryBuilderDbType).build();
};
