import { GlobalProject } from '../project-tree/project-tree.entity';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface StimulusJobData<T, K = {}> {
  data?: T;
  context?: K;
}
export interface SupplierTierJobData {
  tenantId?: string;
  projects?: GlobalProject[];
}

export interface FindSupplierTierJobData {
  supplierIds?: string[];
  parentEntity?: string;
  tier?: number;
  projectTreeThatTriggered?: number;
  userId?: string;
}

export interface UpdateSupplierTierJobData {
  tcrIds?: string[];
  tier?: number;
  projectTreeThatTriggered?: number;
  userId?: string;
}

export interface TrasabilitySupplierTierJobData {
  tier?: number;
  tcrIds?: string[];
  projectTreeThatTriggered?: number;
  userId?: string;
}

export interface CreateTCRJobData {
  supplierIds?: string[];
  parentEntity?: string;
  tier?: number;
  projectTreeThatTriggered?: number;
  userId?: string;
}
