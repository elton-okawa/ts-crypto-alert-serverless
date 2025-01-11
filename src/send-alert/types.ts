import { Decision } from '@src/domain';

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
    color: string;
    code: string;
    value: string;
    decision: Decision;
    streak: string;
  }[];
};
