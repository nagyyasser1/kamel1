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
exports.validateUpdateAccount = exports.validateCreateAccount = exports.updateAccountSchema = exports.createAccountSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = require("../../constants/statusCodes");
exports.createAccountSchema = joi_1.default.object({
    name: joi_1.default.string().trim().required(),
    number: joi_1.default.number().required(),
    email: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().required(),
    categoryId: joi_1.default.string().required(),
});
exports.updateAccountSchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    number: joi_1.default.number().optional(),
    email: joi_1.default.string().trim().optional(),
    description: joi_1.default.string().optional(),
    categoryId: joi_1.default.string().optional(),
});
const validateCreateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.createAccountSchema.validate(req.body, {
        abortEarly: false,
    });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateCreateAccount = validateCreateAccount;
const validateUpdateAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.updateAccountSchema.validate(req.body, {
        abortEarly: false,
    });
    if (result.error) {
        return res.status(statusCodes_1.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    next();
});
exports.validateUpdateAccount = validateUpdateAccount;
