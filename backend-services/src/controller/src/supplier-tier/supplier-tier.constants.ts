export const SUPPLIER_TIER_QUEUE = 'supplier-tier';
export const BUILD_TREE_FROM_TENANT_JOB = 'build_tree_from_tenant_job';
export const DATA_SET_SUPPLIER_TIER = 'data_set_supplier_tier';
export const FIND_TCR_TO_UPDATE_JOB = 'find_tcr_to_update_job';
export const UPDATE_SUPPLIER_TIER_JOB = 'update_supplier_tier_job';
export const DO_TRASABILITY_JOB = 'do_trasability_job';
export const CREATE_TCR_JOB = 'create_tcr_job';
export const MAX_TIER = 4;
export const MIN_TIER_TO_UPWARD = MAX_TIER - 2;

export const BullsOptions = {
  backoff: { type: 'exponential', delay: 100 },
  delay: 500,
};

export enum PROGRESS {
  START = 25,
  MIDDLE = 50,
  CLOSE_TO_END = 75,
  END = 100,
}
