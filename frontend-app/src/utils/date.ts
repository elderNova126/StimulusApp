import moment from 'moment';

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
} as const;

const getLocaleDateFormat = () => {
  const day = 20;
  const month = 11;
  const year = 2000;

  const date = new Date(year, month - 1, day);
  const formattedDate = new Intl.DateTimeFormat(getLocale(), dateOptions).format(date);
  return formattedDate.replace(`${year}`, 'yyyy').replace(`${month}`, 'MM').replace(`${day}`, 'dd');
};

const getLocale = () => navigator.languages?.[0] ?? navigator.language;

const utcStringToLocalDate = (value?: string) => {
  if (value) {
    return new Intl.DateTimeFormat(getLocale(), dateOptions).format(new Date(value));
  }
  return null;
};

const utcStringToLocalDateTime = (value?: string) => {
  if (value) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    } as const;
    return Intl.DateTimeFormat(getLocale(), options).format(new Date(value));
  }
  return null;
};

const utcStringToDifferentDateTime = (value: string) => {
  return moment(new Date(value), 'YYYYMMDD').fromNow();
};

const getUTCDate = (date: string) => {
  const UTCDate =
    ('0' + (new Date(date).getUTCMonth() + 1)).slice(-2) +
    '/' +
    ('0' + new Date(date).getUTCDate()).slice(-2) +
    '/' +
    new Date(date).getFullYear();

  return UTCDate;
};

const getDateAndHours = (date: string) => {
  const UTCDate =
    ('0' + (new Date(date).getUTCMonth() + 1)).slice(-2) +
    '/' +
    ('0' + new Date(date).getUTCDate()).slice(-2) +
    '/' +
    new Date(date).getFullYear();
  return UTCDate;
};

const utcStringToMoment = (value: string | null) => {
  return value ? moment.utc(new Date(value)) : null;
};

const formatStringDate = (value: string | null, patter: string) => {
  return value ? moment(value).format(patter) : null;
};

const getMonthFullnameFromNumber = (monthStr: string) => {
  const valueNumber = new Date(monthStr + '-1-01').getMonth() + 1;

  const date = new Date();
  date.setDate(1);
  date.setMonth(valueNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
};

const setHoursToZero = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

const getLastWeekDate = () => {
  const today = new Date();
  const lastweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return lastweek;
};

const isNotPastDate = (value: string) => {
  const currentDate = moment().format('YYYY-MM-DD');
  return moment(value).isSameOrAfter(currentDate);
};

export {
  getLocaleDateFormat,
  utcStringToLocalDate,
  utcStringToMoment,
  utcStringToLocalDateTime,
  utcStringToDifferentDateTime,
  formatStringDate,
  getUTCDate,
  getMonthFullnameFromNumber,
  getDateAndHours,
  setHoursToZero,
  getLastWeekDate,
  isNotPastDate,
};
