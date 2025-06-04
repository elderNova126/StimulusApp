import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ScopeContextGuard extends AuthGuard('scope-context') {
  options = {
    property: 'scopeContext',
  };

  getRequest(context: any) {
    if (context.contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
    // contextType rest http/https
    return context.getRequest();
  }

  handleRequest(err, scopeContext, info, _context) {
    if (err) {
      throw err || new UnauthorizedException();
    }
    if (info?.name === 'JsonWebTokenError') {
      throw info;
    }
    if (!scopeContext) {
      throw new ForbiddenException();
    }

    return scopeContext;
  }
}
