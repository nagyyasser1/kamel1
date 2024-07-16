import { MailOptions } from "../interfaces/lib/mailer";
import nodemailer from "nodemailer";
import mailConfig from "../config/mailConfig";

const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: false,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

export const sendMail = (options: MailOptions) => {
  return transporter.sendMail(options);
};
