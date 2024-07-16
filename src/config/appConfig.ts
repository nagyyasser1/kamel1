import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  port: number;
  env: string;
  dbUrl: string;
  jwtSecret: string;
  bcryptSalt: number;
  apiPrefix: string;
}

const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  env: process.env.NODE_ENV || "development",
  dbUrl:
    process.env.POSTGRES_PRISMA_URL ||
    "postgresql://postgres:postgres@localhost:5432/mydb",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  bcryptSalt: Number(process.env.BCRYPT_SALT) || 10,
  apiPrefix: process.env.API_PREFIX || "/api",
};

export default appConfig;
