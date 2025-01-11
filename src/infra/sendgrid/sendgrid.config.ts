export const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  mailTo: process.env.SENDGRID_MAIL_TO.split(','),
  mailFrom: process.env.SENDGRID_MAIL_FROM,
  templateId: process.env.SENDGRID_TEMPLATE_ID_CRYPTO_ALERT,
};

export type SendgridConfig = typeof sendgridConfig;
