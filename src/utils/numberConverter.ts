export const convertToNepaliNumber = (number: number | string): string => {
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return number
    .toString()
    .split('')
    .map((digit) => nepaliNumbers[parseInt(digit, 10)])
    .join('');
};
