import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';
import updatePrices from './update-prices';
import updateHistoricalPrices from './update-historical-prices';

export default {
  'send-alert': sendAlert,
  'update-prices': updatePrices,
  'update-historical-prices': updateHistoricalPrices,
} satisfies Record<string, HttpFunction>;
