export type ColoredField = {
  value: string;
  colorClass: string;
};

export type CryptoAlertTemplateData = {
  percentage: {
    code: string;
    yesterday: ColoredField;
    lastWeek: ColoredField;
    lastMonth: ColoredField;
    lastYear: ColoredField;
    lastTwoYears: ColoredField;
  }[];
  price: {
    hexColor: string;
    code: string;
    value: string;
    decision: Decision;
    streak: string;
  }[];
};

export type Decision = 'B' | 'S';
