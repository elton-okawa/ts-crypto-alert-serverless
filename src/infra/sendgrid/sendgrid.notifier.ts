import { INotificationFormatter, INotifier, Notification } from '@src/domain';
import sendgrid from '@sendgrid/mail';
import { SendgridConfig } from './sendgrid.config';
import { Logger } from '@src/logger';

export type FormatterResult = Record<string, any>;

export class SendgridNotifier implements INotifier {
  private readonly logger = new Logger(SendgridNotifier.name);

  constructor(
    private _config: SendgridConfig,
    private _formatter: INotificationFormatter<FormatterResult>,
  ) {
    sendgrid.setApiKey(_config.apiKey);
  }

  async send(notification: Notification): Promise<void> {
    this.logger.log('Sending message...');

    const mail = {
      to: this._config.mailTo,
      from: this._config.mailFrom,
      templateId: this._config.templateId,
      dynamicTemplateData: this._formatter.format(notification),
    };

    await sendgrid.send(mail);

    this.logger.log('Message sent successfully!');
  }
}
