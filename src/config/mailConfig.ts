import { MailConfig } from "../interfaces/lib/mailer";
import dotenv from "dotenv";

dotenv.config();

const mailConfig: MailConfig = {
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  user: process.env.MAIL_USER || "nagyy8751@gmail.com",
  port: parseInt(process.env.MAIL_PORT || "587", 10),
  pass: process.env.MAIL_PASS || "xklk jxlz vxzm tkgp",
};

export default mailConfig;
