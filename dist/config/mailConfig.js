"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mailConfig = {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    user: process.env.MAIL_USER || "nagyy8751@gmail.com",
    port: parseInt(process.env.MAIL_PORT || "587", 10),
    pass: process.env.MAIL_PASS || "xklk jxlz vxzm tkgp",
};
exports.default = mailConfig;
