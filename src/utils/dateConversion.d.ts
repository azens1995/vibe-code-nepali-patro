export declare function getEnglishDate(
  year: number,
  month: number,
  day: number
): string;

export declare function getNepaliDate(adDate: Date): {
  year: number;
  month: number;
  day: number;
};

export declare function getEnglishADDate(
  nepaliYear: number,
  nepaliMonth: number,
  nepaliDay: number
): Date;
