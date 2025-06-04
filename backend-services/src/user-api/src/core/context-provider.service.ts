import { Injectable, Scope, Inject } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { ScopeContext } from './scope-context.class';

@Injectable({ scope: Scope.REQUEST })
export class ContextProviderService {
  constructor(@Inject(CONTEXT) private readonly context) {}
  getScopeContext(): ScopeContext {
    const { scopeContext } = this.context.req ? this.context.req : this.context;
    return scopeContext as ScopeContext;
  }

  getUserContext(): any {
    const { user } = this.context.req ? this.context.req : this.context;
    return user;
  }
}
