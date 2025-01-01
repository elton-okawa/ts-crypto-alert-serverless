import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';
import updatePrices from './update-prices';
import updateHistoricalPrices from './update-historical-prices';
import {
  automatedOrderFunction,
  automatedOrderParamsFunction,
} from '@src/automated-order';

export default {
  'send-alert': sendAlert,
  'update-prices': updatePrices,
  'update-historical-prices': updateHistoricalPrices,
  'automated-order': automatedOrderFunction,
  'automated-order-params': automatedOrderParamsFunction,
} satisfies Record<string, HttpFunction>;
