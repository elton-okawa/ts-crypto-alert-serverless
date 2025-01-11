import { INotificationFormatter, INotifier, Notification } from '@src/domain';
import sendgrid from '@sendgrid/mail';
import { SendgridConfig } from './sendgrid.config';

export type FormatterResult = Record<string, any>;

export class SendgridNotifier implements INotifier {
  constructor(
    private _config: SendgridConfig,
    private _formatter: INotificationFormatter<FormatterResult>,
  ) {
    sendgrid.setApiKey(_config.apiKey);
  }

  async send(notification: Notification): Promise<void> {
    const mail = {
      to: this._config.mailTo,
      from: this._config.mailFrom,
      templateId: this._config.templateId,
      dynamicTemplateData: this._formatter.format(notification),
    };

    await sendgrid.send(mail);
  }
}
