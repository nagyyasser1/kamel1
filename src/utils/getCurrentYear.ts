const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1); // Jan 1st of current year
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // Dec 31st of current year

  const previousYear = currentYear - 1;
  const previousStartOfYear = new Date(previousYear, 0, 1); // Jan 1st of previous year
  const previousEndOfYear = new Date(previousYear, 11, 31, 23, 59, 59); // Dec 31st of previous year

  return {
    currentYear,
    startOfYear,
    endOfYear,
    previousStartOfYear,
    previousEndOfYear,
  };
};

export default getCurrentYear;
