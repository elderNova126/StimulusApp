import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { ConnectionService } from './connection.service';
import { ConnectionProviderService } from 'src/database/connection-provider.service';
import { StimulusSecretClientService } from './stimulus-secret-client.service';
import { ConfigService } from '@nestjs/config';

// FIXME: add dependencies correctly
describe.skip('ConnectionService', () => {
  let service: ConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StimulusSecretClientService, ConnectionProviderService],
      providers: [
        ConnectionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
