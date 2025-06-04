const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('en-US', {
    month: 'short',
  });
};
const setHoursToZero = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date;
};

export { getMonthName, setHoursToZero };
