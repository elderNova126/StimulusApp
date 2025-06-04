import { Badge, BadgeStatus } from './badge.entity';

export class BadgeProvider {
  public static buildBadge(id: string): Badge {
    const badge = new Badge();
    badge.id = id;
    badge.badgeDateLabel = 'optional';
    badge.badgeDateStatus = BadgeStatus.MANDATORY;
    badge.badgeDescription = 'abc';
    badge.tenantId = 'tenantId';
    badge.tenant = { id: 'tenantId' } as any;
    return badge;
  }
}
