import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const COLUMN_NAME = 'comment';
const ValidationCommendSchema = yupResolver(
  yup.object().shape({
    [COLUMN_NAME]: yup.string().required('Comments cannot be empty').max(250, 'Comments cannot exceed 250 characters'),
  }) as any
);

export { COLUMN_NAME, ValidationCommendSchema };
