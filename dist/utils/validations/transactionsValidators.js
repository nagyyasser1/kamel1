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
exports.validateUpdateTransaction = exports.validateCreateTransaction = exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = require("../../constants/statusCodes");
exports.createTransactionSchema = joi_1.default.object({
    fromId: joi_1.default.string().required(),
    toId: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    number: joi_1.default.number().required(),
    description: joi_1.default.string().required(),
    date: joi_1.default.date().optional(),
});
exports.updateTransactionSchema = joi_1.default.object({
    fromAccountId: joi_1.default.string().optional(),
    toAccountId: joi_1.default.string().optional(),
    amount: joi_1.default.number().optional(),
    number: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
});
const validateCreateTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.createTransactionSchema.validate(req.body, {
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
exports.validateCreateTransaction = validateCreateTransaction;
const validateUpdateTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = exports.updateTransactionSchema.validate(req.body, {
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
exports.validateUpdateTransaction = validateUpdateTransaction;
