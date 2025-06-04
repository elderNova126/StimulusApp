export interface EventLog {
  id: string;
  code: string;
  entityId: string;
  entityType: string;
  userName: string;
  userId: string;
  created: string;
  body?: string;
  meta?: MetaEvent;
}

export interface MetaEvent {
  id?: string;
  userId?: string;
  companyId?: string;
  projectId?: string;
  listId?: string;
  listName?: string;
  userInvited?: string;
  departmentId?: string;
  companyName?: string;
  projectName?: string;
  departmentName?: string;
  userName?: string;
  actionType?: string;
  status?: string;
  type?: string;
  setting?: string;
  settingValue?: boolean;
  answers?: string;
  updates?: {
    id: string;
    from: string;
    to: string;
  }[];
}
