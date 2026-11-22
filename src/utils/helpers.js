/**
 * Calculates the current dynamic academic year and semester based on the calendar date.
 * University academic year logic:
 * - If current month is July (6) or later: Year X to (X + 1), Semester I
 * - If current month is before July: Year (X - 1) to X, Semester II
 */
export const getAcademicYearInfo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 0 = Jan, 6 = Jul
  const startYear = month >= 6 ? year : year - 1;
  const endYear = startYear + 1;
  const semester = month >= 6 && month <= 11 ? 'Semester I' : 'Semester II';

  return {
    yearRange: `${startYear}–${endYear}`,
    tag: `AY ${startYear}–${endYear}`,
    fullDisplay: `${startYear} – ${endYear} ${semester}`
  };
};
