import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';
import updatePrices from './update-prices';
import updateHistoricalPrices from './update-historical-prices';

export default {
  sendAlert: sendAlert,
  updatePrices: updatePrices,
  updateHistoricalPrices: updateHistoricalPrices,
} satisfies Record<string, HttpFunction>;
