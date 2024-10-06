"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const appConfig = {
    port: parseInt(process.env.PORT || "3000", 10),
    env: process.env.NODE_ENV || "development",
    dbUrl: process.env.POSTGRES_PRISMA_URL ||
        "postgresql://postgres:postgres@localhost:5432/mydb",
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
    bcryptSalt: Number(process.env.BCRYPT_SALT) || 10,
    apiPrefix: process.env.API_PREFIX || "/api",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
exports.default = appConfig;
