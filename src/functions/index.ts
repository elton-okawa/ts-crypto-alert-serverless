import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';
import updatePrice from './update-price';

export default {
  'send-alert': sendAlert,
  'update-price': updatePrice,
} satisfies Record<string, HttpFunction>;
