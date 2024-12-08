import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';
import updatePrices from './update-prices';
import updateHistoricalPrices from './update-historical-prices';
import automatedOrder from './automated-order';
import automatedOrderParameters from './automated-order-parameters';

export default {
  'send-alert': sendAlert,
  'update-prices': updatePrices,
  'update-historical-prices': updateHistoricalPrices,
  'automated-order': automatedOrder,
  'automated-order-params': automatedOrderParameters,
} satisfies Record<string, HttpFunction>;
