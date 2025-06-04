import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ExternalBasicStrategy extends PassportStrategy(BasicStrategy, 'external-basic') {
  constructor(private readonly moduleRef: ModuleRef) {
    super(
      {
        passReqToCallback: true,
      },
      async (req: Request, username: string, password: string, done: (error: any, user?: any) => void) => {
        return await this.validate(req, username, password, done);
      }
    );
  }

  async validate(req: Request, username: string, password: string, done: (error: any, user?: any) => void) {
    let externalAccessUserValid = false;
    try {
      const contextId = ContextIdFactory.getByRequest(req);
      const authService = await this.moduleRef.resolve(AuthService, contextId);
      externalAccessUserValid = await authService.validateExternalAccessUser(username, password);
    } catch (err) {
      return done(err);
    }
    return done(null, externalAccessUserValid);
  }
}
