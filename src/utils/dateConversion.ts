import { getNepaliMonthDays } from './nepaliCalendar';

// Base date: 2040-01-01 BS = 1983-04-14 AD
const BASE_BS_DATE = {
  year: 2040,
  month: 1,
  day: 1,
};

const BASE_AD_DATE = new Date(1983, 3, 14); // Month is 0-based in JS Date

// Function to get English (Gregorian) date from Nepali date
export const getEnglishDate = (
  year: number,
  month: number,
  day: number
): string => {
  const totalDays = getDaysSinceBase(year, month, day);
  const date = new Date(BASE_AD_DATE);
  date.setDate(date.getDate() + totalDays);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to calculate days since base date
const getDaysSinceBase = (year: number, month: number, day: number): number => {
  let totalDays = 0;

  // Add days for complete years
  for (let y = BASE_BS_DATE.year; y < year; y++) {
    for (let m = 1; m <= 12; m++) {
      totalDays += getNepaliMonthDays(y, m);
    }
  }

  // Add days for complete months in current year
  for (let m = 1; m < month; m++) {
    totalDays += getNepaliMonthDays(year, m);
  }

  // Add remaining days in current month
  totalDays += day - BASE_BS_DATE.day;

  return totalDays;
};

export const getNepaliDate = (
  adDate: Date
): { year: number; month: number; day: number } => {
  const diffTime = adDate.getTime() - BASE_AD_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let nepaliYear = BASE_BS_DATE.year;
  let nepaliMonth = BASE_BS_DATE.month;
  let nepaliDay = BASE_BS_DATE.day;

  let remainingDays = diffDays;

  if (remainingDays >= 0) {
    while (remainingDays > 0) {
      const daysInMonth = getNepaliMonthDays(nepaliYear, nepaliMonth);
      const daysRemainingInMonth = daysInMonth - nepaliDay + 1;

      if (remainingDays >= daysRemainingInMonth) {
        remainingDays -= daysRemainingInMonth;
        nepaliMonth++;
        nepaliDay = 1;

        if (nepaliMonth > 12) {
          nepaliMonth = 1;
          nepaliYear++;
        }
      } else {
        nepaliDay += remainingDays;
        remainingDays = 0;
      }
    }
  } else {
    while (remainingDays < 0) {
      if (nepaliDay > 1) {
        const daysToSubtract = Math.min(nepaliDay - 1, -remainingDays);
        nepaliDay -= daysToSubtract;
        remainingDays += daysToSubtract;
      } else {
        nepaliMonth--;
        if (nepaliMonth < 1) {
          nepaliMonth = 12;
          nepaliYear--;
        }
        nepaliDay = getNepaliMonthDays(nepaliYear, nepaliMonth);
        remainingDays++;
      }
    }
  }

  return { year: nepaliYear, month: nepaliMonth, day: nepaliDay };
};

export const getEnglishADDate = (
  nepaliYear: number,
  nepaliMonth: number,
  nepaliDay: number
): Date => {
  const totalDays = getDaysSinceBase(nepaliYear, nepaliMonth, nepaliDay);
  const englishDate = new Date(BASE_AD_DATE);
  englishDate.setDate(englishDate.getDate() + totalDays);
  return englishDate;
};
