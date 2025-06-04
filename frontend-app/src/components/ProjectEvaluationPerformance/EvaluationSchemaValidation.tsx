import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const BUDGET_SPENT = 'evaluation_budget_spent';
const ValidationCommendSchema = yupResolver(
  yup.object().shape({
    [BUDGET_SPENT]: yup.number().max(2000000000, 'Actual spend can not exceed 2,000,000,000'),
  }) as any
);

export { BUDGET_SPENT, ValidationCommendSchema };
