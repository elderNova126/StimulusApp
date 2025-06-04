const calculateRemainingDays = (expirationDate: string): number => {
  const currentDate = new Date();
  const expiration = new Date(expirationDate);
  const timeDiff = expiration.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

function getExpirationInfo(remainingDays: number): string {
  if (remainingDays > 0 && remainingDays <= 90) {
    return `Expires in ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
  } else if (remainingDays <= 0) {
    return `Expired`;
  }
  return '';
}

function getExpirationDays(remainingDays: number): string {
  const daysInYear = 365;
  if (remainingDays <= 0) {
    return 'Expired';
  } else if (remainingDays > daysInYear) {
    const years = Math.floor(remainingDays / daysInYear);
    return `+${years} ${years === 1 ? 'Year' : 'Years'}`;
  } else {
    return `${remainingDays} ${remainingDays === 1 ? 'Day' : 'Days'}`;
  }
}

export { calculateRemainingDays, getExpirationInfo, getExpirationDays };
