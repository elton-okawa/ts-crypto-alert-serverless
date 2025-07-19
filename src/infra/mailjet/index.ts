import { INotificationFormatter } from '@src/domain';
import { mailjetConfig } from './mailjet.config';
import { FormatterResult, MailjetNotifier } from './mailjet.notifier';

export const mailjetNotifierFactory = (
  formatter: INotificationFormatter<FormatterResult>,
) => new MailjetNotifier(mailjetConfig, formatter);
