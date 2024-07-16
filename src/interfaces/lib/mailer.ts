interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface MailConfig {
  host: string;
  user: string;
  pass: string;
  port: number;
}

export { MailOptions, MailConfig };
