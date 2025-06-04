export const ProjectsDateFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#basic`,
  displaySettings: {
    isHiddenInViewMode: false,
    displayName: 'Date',
  },
  filterType: 1,
  operator: 'All',
  requireSingleSelection: false,
  target: { table: 'tenant project', column: 'created_date_month' },
  values: [],
};

export const ProjectsTenantFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#advanced`,
  conditions: [],
  displaySettings: { isHiddenInViewMode: false, displayName: 'Projects' },
  filterType: 0,
  logicalOperator: 'And',
  target: { table: 'tenant project', column: 'id' },
};

export const TotalSpendDateFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#basic`,
  displaySettings: {
    isHiddenInViewMode: false,
    displayName: 'Date',
  },
  filterType: 1,
  operator: 'All',
  requireSingleSelection: false,
  target: { table: 'tenant company_evaluation', column: 'created_date_month' },
  values: [],
};

export const TotalSpendFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#advanced`,
  conditions: [],
  displaySettings: { isHiddenInViewMode: false, displayName: 'Spent' },
  filterType: 0,
  logicalOperator: 'And',
  target: { table: 'tenant company_evaluation', column: 'budgetSpend' },
};

export const SuppliersDateFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#basic`,
  displaySettings: {
    isHiddenInViewMode: false,
    displayName: 'Date',
  },
  filterType: 1,
  operator: 'All',
  requireSingleSelection: false,
  target: { table: 'global tenant_company_data', column: 'created_date_month' },
  values: [],
};

export const SuppliersFilters = {
  $schema: `${process.env.REACT_APP_POWERBI_SCHEMA}#advanced`,
  conditions: [],
  displaySettings: { isHiddenInViewMode: false, displayName: 'Suppliers' },
  filterType: 0,
  logicalOperator: 'And',
  target: { table: 'global tenant_company_data', column: 'id' },
};
