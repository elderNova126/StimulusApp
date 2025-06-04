export class CreateExternalSystemAuth {
  name: string;

  tenantId: string;

  userId: string;

  expire?: Date;
}

export class ExternalSystemAuth {
  id?: string;

  tenantId: string;

  userId: string;

  apiKey?: string;

  name: string;

  status: string;

  expire: Date;
}

export class ExternalSystemByTenant {
  tenantId: string;
}
