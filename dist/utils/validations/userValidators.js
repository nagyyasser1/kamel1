"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryUsers = exports.validateUpdateUser = exports.validateCreateUser = exports.queryUsersSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const bcrypt = __importStar(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = require("../../constants/statusCodes");
const appConfig_1 = __importDefault(require("../../config/appConfig"));
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 0] = "ADMIN";
    Role[Role["ACCOUNTANT"] = 1] = "ACCOUNTANT";
    Role[Role["REVIEWER"] = 2] = "REVIEWER";
})(Role || (Role = {}));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    role: joi_1.default.string()
        .valid(...Object.values(Role))
        .required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    phone: joi_1.default.string().optional(),
    role: joi_1.default.string()
        .valid(...Object.values(Role))
        .optional(),
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().min(8).optional(),
});
exports.queryUsersSchema = joi_1.default.object({
    role: joi_1.default.string()
        .valid(...Object.values(Role))
        .optional(),
});
const validateCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.createUserSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    const saltRounds = appConfig_1.default.bcryptSalt;
    try {
        const hashedPassword = yield bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
    }
    catch (error) {
        console.error("Error hashing password:", error);
        return res
            .status(statusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal server error" });
    }
    next();
});
exports.validateCreateUser = validateCreateUser;
const validateUpdateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.updateUserSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    if (req.body.password) {
        const saltRounds = appConfig_1.default.bcryptSalt;
        try {
            const hashedPassword = yield bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
        }
        catch (error) {
            console.error("Error hashing password:", error);
            return res
                .status(statusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }
    next();
});
exports.validateUpdateUser = validateUpdateUser;
const validateQueryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.queryUsersSchema.validate(req.query, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateQueryUsers = validateQueryUsers;
