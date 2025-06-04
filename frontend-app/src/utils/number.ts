import { abbreviateNumber } from 'js-abbreviation-number';

const thousand = 1000;
const million = 1000000;

const abbreviateNumberWithOption = (target: number, digit: number) => {
  return abbreviateNumber(target, digit, {
    padding: false,
    symbols: ['', 'K', 'M', 'B', 'T'],
  })
    .replace('.0', '')
    .toLocaleUpperCase();
};

const divideBy = (target: number, divisor: number): number => {
  return Math.round((target / divisor) * 100) / 100;
};

const convertToThousands = (endWith: string, value: number): string => {
  return `${divideBy(value, thousand)} ${endWith}`;
};

const convertToMillions = (endWith: string, value: number): string => {
  return `${divideBy(value, million)} ${endWith}`;
};

const totalNumberSidebar = (result: number) => {
  if (result >= 1000) {
    const total = Math.floor(result / thousand);
    return result % thousand === 0 ? `${total}K` : `${total}K +`;
  } else {
    return result;
  }
};

const formatTotalSpend = (totalSpend: number) => {
  if (totalSpend < 1000) return `$${totalSpend}`;
  return abbreviateNumberWithOption(totalSpend, 1);
};

const convertToShortNo = (endWith: { thousand: string; million: string }, value?: number): string => {
  let result: any = value;

  if (value && value > thousand) {
    let resultNo = divideBy(value, million);
    let endResult = endWith.million;

    if (resultNo < 1) {
      resultNo = divideBy(value, thousand);
      endResult = endWith.thousand;
    }

    result = `${localeNumberFormat(resultNo)} ${endResult}`;
  }

  return result;
};

const getColorByPercentage = (value: number) => {
  let color;

  if (value === null) {
    color = 'primary';
  } else if (value >= 50) {
    color = 'green.600';
  } else if (value > 25) {
    color = '#CC4E05';
  } else {
    color = 'secondary';
  }
  return color;
};

const getLocale = () => {
  return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
};

const localeUSDFormat = (value: number) =>
  new Intl.NumberFormat(getLocale() ?? 'en-US', { style: 'currency', currency: 'USD' }).format(value);

const localeUSDFormatProject = (value: number) => {
  const newValue = new Intl.NumberFormat(getLocale() ?? 'en-US', { style: 'currency', currency: 'USD' }).format(value);
  const newValueArray = newValue.split('$');
  return `$${newValueArray[1]} ${newValueArray[0] === 'US' ? 'USD' : newValueArray[0]}`;
};

const localeNumberFormat = (value: number) => value && new Intl.NumberFormat(getLocale()).format(value);

export {
  convertToThousands,
  convertToMillions,
  convertToShortNo,
  totalNumberSidebar,
  formatTotalSpend,
  localeUSDFormat,
  localeNumberFormat,
  getColorByPercentage,
  localeUSDFormatProject,
};
