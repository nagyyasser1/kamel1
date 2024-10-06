"use strict";
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
exports.validateResetPasswordWithCurrent = exports.validateVerifyResetCode = exports.validateResetPassword = exports.validateForgotPassword = exports.validateSignIn = exports.validateSignUp = exports.resetPasswordWithCurrentSchema = exports.verifyResetCodeSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.signUpSchema = exports.signInSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = require("../../constants/statusCodes");
exports.signInSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
exports.signUpSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
});
exports.verifyResetCodeSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    code: joi_1.default.string().required(),
});
exports.resetPasswordWithCurrentSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
});
const validateSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.signUpSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateSignUp = validateSignUp;
const validateSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.signInSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateSignIn = validateSignIn;
const validateForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.forgotPasswordSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateForgotPassword = validateForgotPassword;
const validateResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.resetPasswordSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateResetPassword = validateResetPassword;
const validateVerifyResetCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.verifyResetCodeSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateVerifyResetCode = validateVerifyResetCode;
const validateResetPasswordWithCurrent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.resetPasswordWithCurrentSchema.validate(req.body, { abortEarly: false });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateResetPasswordWithCurrent = validateResetPasswordWithCurrent;
