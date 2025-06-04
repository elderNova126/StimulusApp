import { Module, Global } from '@nestjs/common';
import { StimulusSecretClientService } from './stimulus-secret-client.service';
import { CoreController } from './core.controller';
import { ConnectionService } from './connection.service';
import { adProviders } from './ad.providers';
import { ReqContextResolutionService } from './req-context-resolution.service';
import { mailProviders } from './mail.providers';

@Global()
@Module({
  providers: [
    StimulusSecretClientService,
    ConnectionService,
    ReqContextResolutionService,
    ...adProviders,
    ...mailProviders,
  ],
  exports: [StimulusSecretClientService, ReqContextResolutionService, ...adProviders, ...mailProviders],
  controllers: [CoreController],
})
export class CoreModule {}
