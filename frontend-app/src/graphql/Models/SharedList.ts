import { User } from '../types';
import { ICompanyList } from './CompanyList';

export interface ISharedList {
  id: string;
  status: SharedListStatus;
  user: User;
  companyList: ICompanyList;
  created: any;
}
export interface ISharedListCollaborator extends User {
  sharedListId: string;
  status: SharedListStatus;
}

export enum SharedListStatus {
  PENDING = 'pending',
  APPROVED = 'accepted',
  DECLINED = 'declined',
  DELETED = 'deleted',
}
