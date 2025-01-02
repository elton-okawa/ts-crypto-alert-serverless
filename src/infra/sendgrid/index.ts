import { sendgridConfig } from './sendgrid.config';
import { SendgridNotifier } from './sendgrid.notifier';

export const sendgridNotifier = new SendgridNotifier(sendgridConfig);
