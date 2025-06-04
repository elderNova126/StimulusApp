import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

/*
 * Remove field results based on tenantCompanyRelation.
 * If the company is set to inactive or the type is external
 * this information will be removed from the user visibility.
 * The count field will be kept this information will be displayed
 *
 * Field format:
 * 	{
 * 		results: []
 * 		count: number
 * 	}
 */

export const companyTypeMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
  const { source } = ctx;
  const tenantCompanyRelation = source?.tenantCompanyRelation;
  if (!tenantCompanyRelation) return null;
  const field = await next();
  if (tenantCompanyRelation.status === 'inactive' || tenantCompanyRelation.type === 'external') field.results = [];
  return field;
};
