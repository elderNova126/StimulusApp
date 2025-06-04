import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isNotPastDate } from '../../../../utils/date';

const ValidationBadgeDateSchema = (date: string, status: string) =>
  yupResolver(
    yup.object().shape({
      [date]: yup.string().when([status], {
        is: 'mandatory',
        then: () => {
          return yup
            .string()
            .required('Badge Date is a required field')
            .test('future-date', 'Date can not be prior to the current day', isNotPastDate);
        },
        otherwise: () =>
          yup
            .string()
            .nullable()
            .test(
              'future-date',
              'Date can not be prior to the current day',
              (value) => value === '' || isNotPastDate(value ?? '')
            ),
      }),
    }) as any
  );

export { ValidationBadgeDateSchema };
