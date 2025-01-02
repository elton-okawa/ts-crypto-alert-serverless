import { INotifier, Notification } from '@src/domain';
import sendgrid from '@sendgrid/mail';
import { SendgridConfig } from './sendgrid.config';

export class SendgridNotifier implements INotifier {
  constructor(private _config: SendgridConfig) {
    sendgrid.setApiKey(_config.apiKey);
  }

  async send(notification: Notification): Promise<void> {
    const mail = {
      to: this._config.mailTo,
      from: this._config.mailFrom,
      templateId: this._config.templateId,
      dynamicTemplateData: this.getTemplateData(notification),
    };
    await sendgrid.send(mail);
  }

  private getTemplateData(notification: Notification) {
    return {};
  }
}
