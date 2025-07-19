export const mailjetConfig = {
  apiKey: process.env.MAILJET_API_KEY,
  secretKey: process.env.MAILJET_SECRET_KEY,
  mailTo: process.env.MAILJET_MAIL_TO.split(','),
  mailFrom: process.env.MAILJET_MAIL_FROM,
};

export type MailjetConfig = typeof mailjetConfig;
