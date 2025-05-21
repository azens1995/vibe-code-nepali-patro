export function getEnglishDate(
  year: number,
  month: number,
  day: number
): string;

export function getNepaliDate(adDate: Date): {
  year: number;
  month: number;
  day: number;
};

export function getEnglishADDate(
  nepaliYear: number,
  nepaliMonth: number,
  nepaliDay: number
): Date;
