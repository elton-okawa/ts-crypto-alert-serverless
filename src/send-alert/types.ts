export type ColoredField = {
  value: string;
  color: string;
};

export type CryptoAlertTemplateData = {
  subject: string;
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
