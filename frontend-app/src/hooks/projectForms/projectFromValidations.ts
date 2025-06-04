import { object, number, string, date } from 'yup';

export enum ProjectFormFields {
  BUDGET = 'Project Budget',
  PROJECT_TITLE = 'Title',
  PROJECT_START_DATE = 'Start',
  PROJECT_END_DATE = 'End',
  PROJECT_DESCRIPTION = 'Description',
  PROJECT_ID_CONTRACT_NO = 'Contract Number',
  KEYWORDS = 'Keywords',
  PARENT_PROJECT_ID = 'Parent Project ID',
}

const ProjectSchemaValidation = {
  [ProjectFormFields.PROJECT_TITLE]: string()
    .required('Project Title is required')
    .max(250, 'Project Title can not exceed 250 characters'),
  [ProjectFormFields.PROJECT_START_DATE]: date()
    .required('Project Start Date is required')
    .test('this-exist', 'Project Start Date is required', (value) => {
      return !!value;
    }),
  [ProjectFormFields.PROJECT_END_DATE]: date().test(
    'min-date',
    'End Date can not be before Start Date',
    (value, context) => {
      const { [ProjectFormFields.PROJECT_START_DATE]: startDate } = context.parent;
      if (!startDate || !value) return true;
      return new Date(startDate) <= new Date(value);
    }
  ),
  [ProjectFormFields.PROJECT_DESCRIPTION]: string()
    .max(1500, 'Project Description can not exceed 1500 characters')
    .test(
      'contains-alphanumeric',
      'Project Description Only can contain at least one alphanumerical character if they are required, non-just space',
      (value) => {
        if (!value) return true;
        return value.trim().length > 0;
      }
    ),
  [ProjectFormFields.PROJECT_ID_CONTRACT_NO]: number().typeError(
    'Project ID/Contract No is required and must be a number '
  ),
  [ProjectFormFields.BUDGET]: number()
    .required('Project Budget is required and must be greater than 0')
    .typeError('Project Budget is required and must be a number ')
    .min(1, 'Project Budget is required and must be greater than 0')
    .max(2000000000, 'Project Budget can not exceed 2,000,000,000'),
  [ProjectFormFields.KEYWORDS]: string().max(250, 'Keywords can not exceed 250 characters'),
  [ProjectFormFields.PARENT_PROJECT_ID]: number()
    .typeError('Parent Project ID must be a number ')
    .transform((value) => (isNaN(value) ? undefined : value)),
} as any;

export default object().shape({
  ...ProjectSchemaValidation,
});
