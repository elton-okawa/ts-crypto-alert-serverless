import { Decision } from '@src/domain';

export type StyledField = {
  value: string;
  style: string;
};

export type PriceHistoryField = {
  min: StyledField;
  max: StyledField;
};

export type CryptoAlertTemplateData = {
  subject: string;
  percentage: {
    code: string;
    yesterday: StyledField;
    lastWeek: StyledField;
    lastMonth: StyledField;
    lastYear: StyledField;
    lastTwoYears: StyledField;
  }[];
  price: {
    color: string;
    code: string;
    value: StyledField;
    decision: Decision;
    streak: string;
    // example of possible keys: lastYear, lastTwoYears
    history: Record<string, PriceHistoryField>;
  }[];
};
