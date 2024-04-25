import { HttpFunction } from '@google-cloud/functions-framework';
import sendAlert from './send-alert';

export default {
  'send-alert': sendAlert,
} satisfies Record<string, HttpFunction>;
