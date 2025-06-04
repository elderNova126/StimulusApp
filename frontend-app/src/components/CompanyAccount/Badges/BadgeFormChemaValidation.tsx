import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export enum BadgeFormFields {
  BADGE_NAME = 'Badge Name',
  BADGE_DESCRIPTION = 'Description',
  DATE_STATUS = 'Date Status',
  DATE_LABEL = 'Date Label',
}

const ValidationBadgeSchema = yupResolver(
  yup.object().shape({
    [BadgeFormFields.BADGE_DESCRIPTION]: yup
      .string()
      .notRequired()
      .max(1500, 'Description can not exceed 1500 characters')
      .strict(),
    [BadgeFormFields.BADGE_NAME]: yup.string().strict().required().max(50, 'Badge Name can not exceed 50 characters'),
    [BadgeFormFields.DATE_STATUS]: yup.string().required(),
    [BadgeFormFields.DATE_LABEL]: yup.string().notRequired().max(30, 'Label Date can not exceed 30 characters'),
  }) as any
);

export { ValidationBadgeSchema };
