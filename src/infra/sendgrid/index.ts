import { INotificationFormatter } from '@src/domain';
import { sendgridConfig } from './sendgrid.config';
import { FormatterResult, SendgridNotifier } from './sendgrid.notifier';

export const sendgridNotifierFactory = (
  formatter: INotificationFormatter<FormatterResult>,
) => new SendgridNotifier(sendgridConfig, formatter);
