function getMonthRange(
  year: number,
  month: number
): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month
  return { start, end };
}

export default getMonthRange;
