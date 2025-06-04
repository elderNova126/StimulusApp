export interface ApiKey {
  id: string;
  name: string;
  apiKey: string;
  tenantId: string;
  created: string;
  status: ApiKeyStatus;
}

type ApiKeyStatus = 'ACTIVE' | 'INACTIVE';

export enum ApiKeyStatusOptions {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
