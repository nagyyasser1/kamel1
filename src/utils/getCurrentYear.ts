const getCurrentYear = (): {
  currentYear: number;
  startOfYear: Date;
  endOfYear: Date;
} => {
  const currentYear = new Date().getFullYear();

  // Get the start and end dates for the current year
  const startOfYear = new Date(currentYear, 0, 1); // January 1st
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st

  return {
    currentYear,
    startOfYear,
    endOfYear,
  };
};

export default getCurrentYear;
