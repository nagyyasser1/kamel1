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
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = require("../../constants/statusCodes");
const createProductTransSchema = joi_1.default.object({
    income: joi_1.default.number().required(),
    outcome: joi_1.default.number().required(),
    accountId: joi_1.default.string().required(),
    createdAt: joi_1.default.date().optional(),
});
const validateCreateProductTrans = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = createProductTransSchema.validate(req.body, {
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
exports.default = {
    validateCreateProductTrans,
};
