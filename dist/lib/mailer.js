"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailConfig_1 = __importDefault(require("../config/mailConfig"));
const transporter = nodemailer_1.default.createTransport({
    host: mailConfig_1.default.host,
    port: mailConfig_1.default.port,
    secure: false,
    auth: {
        user: mailConfig_1.default.user,
        pass: mailConfig_1.default.pass,
    },
});
const sendMail = (options) => {
    return transporter.sendMail(options);
};
exports.sendMail = sendMail;
