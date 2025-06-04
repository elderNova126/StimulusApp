import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';

const getTenantIdFromContext = (ctx) => {
  const { scopeContext } = ctx?.req;
  let tenantId;
  if (scopeContext) {
    tenantId = scopeContext?.tenantId;
  }
  return tenantId;
};

const createGqlContext = (ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext();

export const ResGql = createParamDecorator((_data, ctx: ExecutionContext): Response => createGqlContext(ctx)?.res);

export const GqlUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => createGqlContext(ctx)?.req?.user
);

export const GqlReq = createParamDecorator((_data, ctx: ExecutionContext) => createGqlContext(ctx).req);

export const GqlTenantId = createParamDecorator((_data, ctx: ExecutionContext) =>
  getTenantIdFromContext(createGqlContext(ctx))
);

export const GqlTenant = createParamDecorator((_data, ctx: ExecutionContext) => createGqlContext(ctx)?.req?.tenant);
