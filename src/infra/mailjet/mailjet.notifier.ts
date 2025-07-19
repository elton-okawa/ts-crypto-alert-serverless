import { INotificationFormatter, INotifier, Notification } from '@src/domain';
import { MailjetConfig } from './mailjet.config';
import { Logger } from '@src/logger';
import Mailjet from 'node-mailjet';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export type FormatterResult = Record<string, any>;

export class MailjetNotifier implements INotifier {
  private readonly logger = new Logger(MailjetNotifier.name);

  constructor(
    private _config: MailjetConfig,
    private _formatter: INotificationFormatter<FormatterResult>,
  ) {}

  async send(notification: Notification): Promise<void> {
    this.logger.log('Sending message...');

    const mailjet = Mailjet.apiConnect(
      this._config.apiKey,
      this._config.secretKey,
    );

    const subject = `Crypto Alert - ${new Date().toISOString().substring(0, 10)}`;
    const message = {
      From: { Email: this._config.mailFrom, Name: 'E11EVEN Robot' },
      To: this._config.mailTo.map((mail) => ({ Email: mail, Name: mail })),
      Subject: subject,
      TextPart: subject,
      HTMLPart: this.renderTemplate(
        'template',
        this._formatter.format(notification),
      ),
    };

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [message],
    });

    this.logger.log('Message sent successfully!');
  }

  private renderTemplate(templateName: string, data: FormatterResult): string {
    const filePath = path.join(__dirname, `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const compiledTemplate = handlebars.compile(source);
    return compiledTemplate(data);
  }
}
