import { getNepaliMonthDays } from './nepaliCalendar';

// Base date: 2082-02-07 BS = 2025-05-21 AD
const BASE_BS_DATE = {
  year: 2082,
  month: 2,
  day: 7,
};

const BASE_AD_DATE = new Date(2025, 4, 21); // Month is 0-based in JS Date

// Function to get English (Gregorian) date from Nepali date
export const getEnglishDate = (
  year: number,
  month: number,
  day: number
): string => {
  // Base date reference: 2040-01-01 BS = 1983-04-14 AD
  const baseNepaliYear = 2040;
  const baseNepaliMonth = 1;
  const baseNepaliDay = 1;
  const baseEnglishYear = 1983;
  const baseEnglishMonth = 4;
  const baseEnglishDay = 14;

  // Calculate days since base date
  const daysSinceBase = getDaysSinceBase(year, month, day);

  // Convert to JavaScript Date object starting from base English date
  const date = new Date(baseEnglishYear, baseEnglishMonth - 1, baseEnglishDay);
  date.setDate(date.getDate() + daysSinceBase);

  // Format the date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to calculate days since base date
const getDaysSinceBase = (year: number, month: number, day: number): number => {
  const baseYear = 2040;
  const baseMonth = 1;
  const baseDay = 1;

  let totalDays = 0;

  // Days in complete years
  for (let y = baseYear; y < year; y++) {
    totalDays += getDaysInNepaliYear(y);
  }

  // Days in complete months of current year
  for (let m = baseMonth; m < month; m++) {
    totalDays += getDaysInNepaliMonth(year, m);
  }

  // Days in current month
  totalDays += day - baseDay;

  return totalDays;
};

// Helper function to get days in a Nepali year
const getDaysInNepaliYear = (year: number): number => {
  let totalDays = 0;
  for (let month = 1; month <= 12; month++) {
    totalDays += getDaysInNepaliMonth(year, month);
  }
  return totalDays;
};

// Helper function to get days in a Nepali month
const getDaysInNepaliMonth = (year: number, month: number): number => {
  // This is a simplified version. In a real implementation, you would need
  // a complete mapping of days for each month of each year
  const daysInMonth = [
    31,
    31,
    31,
    32,
    31,
    31,
    30,
    30,
    29,
    30,
    29,
    31, // 2040 BS
  ];
  return daysInMonth[month - 1];
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
  // Logic to convert Nepali date to English AD date
  // This should be replaced with actual conversion logic
  const baseNepaliYear = 2082;
  const baseNepaliMonth = 2; // Jestha
  const baseNepaliDay = 7;
  const baseEnglishDate = new Date(2025, 4, 21); // May 21, 2025

  let totalDays = nepaliDay - baseNepaliDay;

  for (let y = baseNepaliYear; y < nepaliYear; y++) {
    for (let m = 1; m <= 12; m++) {
      totalDays += getNepaliMonthDays(y, m);
    }
  }

  for (let m = baseNepaliMonth; m < nepaliMonth; m++) {
    totalDays += getNepaliMonthDays(nepaliYear, m);
  }

  const englishDate = new Date(baseEnglishDate);
  englishDate.setDate(baseEnglishDate.getDate() + totalDays);

  return englishDate;
};
