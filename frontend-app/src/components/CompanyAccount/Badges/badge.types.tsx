export interface Badge {
  id: string;
  badgeName: string;
  badgeDateStatus: string;
  badgeDescription: string;
  badgeDateLabel: string;
  badgeTenantCompanyRelationships: BadgeTenantRelationship[];
  tenant: {};
}

export interface BadgeTenantRelationship {
  id: string;
  badgeDate?: string;
  badgeId?: string;
  tenantCompanyRelationshipId?: string;
}
