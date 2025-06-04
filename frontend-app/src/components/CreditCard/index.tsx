import React from 'react';
import { TextField, Button, Select, FormControl } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { getLocaleDateFormat } from '../../utils/date';

interface CreditCardProps {
  cardNameHook: [string, (val: string) => void];
  cardNumberHook: [string, (val: string) => void];
  cardExpirationDate: [any, (val: any) => void];
  cardPostalCode: [string, (val: string) => void];
  next: () => void;
  prev: () => void;
}

const CreditCard = (props: CreditCardProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm();

  const {
    cardNameHook: [cardName, setCardName],
    cardNumberHook: [cardNumber, setCardNumber],
    cardExpirationDate: [expirationDate, setExpirationDate],
    cardPostalCode: [postalCode, setPostalCode],
    next,
    prev,
  } = props;

  return (
    <div data-testid="credit-card-component">
      <div className={classes.body}>
        <div className={classes.bodyAction} onClick={prev}>
          <span className={classes.bodyActionItem}>{t('< Back')}</span>
        </div>
        <div className={classes.formWrapper}>
          <form className={classes.form} onSubmit={handleSubmit(next)}>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Payment Method')}</label>
              <FormControl variant="outlined">
                <Select native value={'credit_card'} data-testid="payment-options">
                  <option value={'credit_card'}>{t('Credit Card')}</option>
                </Select>
              </FormControl>
            </div>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Name on Card')}</label>
              <TextField
                inputProps={{
                  'data-testid': 'card-name-field',
                  'aria-label': 'cardName',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                variant="outlined"
              />
              {errors.cardName && (
                <span role="alert" className={classes.errorMessage} data-testid="cardName-error">
                  {errors.cardName.message}
                </span>
              )}
            </div>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Card Number')}</label>
              <TextField
                inputProps={{
                  'data-testid': 'card-number-field',
                  ref: register({
                    required: t('This is required') as string,
                    minLength: { value: 16, message: t('16 digits value') },
                    maxLength: { value: 16, message: t('16 digits value') },
                  }),
                }}
                name="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                variant="outlined"
              />
              {errors.cardNumber && (
                <span role="alert" className={classes.errorMessage}>
                  {errors.cardNumber.message}
                </span>
              )}
            </div>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Expiration Date')}</label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  disablePast
                  margin="normal"
                  format={getLocaleDateFormat()}
                  value={expirationDate}
                  data-testid="card-expiration-date"
                  inputProps={{
                    'data-testid': 'inner-card-expiration-date',
                  }}
                  onChange={(date: Date | null) => setExpirationDate(moment(date))}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Postal Code')}</label>
              <TextField
                inputProps={{
                  'data-testid': 'postal-code-field',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                variant="outlined"
              />
              {errors.postalCode && (
                <span role="alert" className={classes.errorMessage}>
                  {errors.postalCode.message}
                </span>
              )}
            </div>
            <div className={classes.formItem}>
              <label className={classes.label}>{t('Country')}</label>
              <FormControl variant="outlined">
                <Select native value={'usa'} data-testid="country-options">
                  <option value={'usa'}>{t('USA')}</option>
                </Select>
              </FormControl>
            </div>
            <div className={classes.formItem}>
              <Button
                data-testid="submit-button"
                className={classes.button}
                disableElevation
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                {t('CREATE COMPANY')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
