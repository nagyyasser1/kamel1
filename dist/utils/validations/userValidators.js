"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required().min(8),
});
const validateUser = (req, res, next) => {
    // Validate user data
    const result = exports.userSchema.validate(req.body, { abortEarly: false } // Return all errors
    );
    // If errors, return error response
    if (result.error) {
        return res.status(422).json({
            message: "Invalid request data",
            errors: result.error.details.map((err) => err.message),
        });
    }
    // If no errors, continue to next handler
    next();
};
exports.validateUser = validateUser;
