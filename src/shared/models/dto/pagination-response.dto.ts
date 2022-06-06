import { FindManyOptions } from 'typeorm';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { calculatePaginationPage } from '../../utils/number.utils';

export class PaginationResponseDto<T> {
  page: number;
  limit: number;
  totalCount: number;
  results: T[];

  constructor(query: FindManyOptions<any>, count: number, data: T[]) {
    this.limit = query.take;
    this.page = calculatePaginationPage(query.skip, this.limit);
    this.totalCount = count;
    this.results = data;
  }
}

export const ApiPaginatedResponseDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              totalCount: {
                type: 'number',
              },
              page: {
                type: 'number',
              },
              limit: {
                type: 'number',
              },
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
