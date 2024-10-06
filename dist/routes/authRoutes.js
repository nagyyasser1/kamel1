"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authValidators_1 = require("../utils/validations/authValidators");
const router = (0, express_1.Router)();
router.post("/signUp", authValidators_1.validateSignUp, authController_1.default.signUp);
router.post("/signIn", authValidators_1.validateSignIn, authController_1.default.signIn);
router.post("/forgot-password", authValidators_1.validateForgotPassword, authController_1.default.forgotPassword);
router.post("/verify-reset-code", authValidators_1.validateVerifyResetCode, authController_1.default.verifyResetCode);
router.post("/reset-password", authValidators_1.validateResetPassword, authController_1.default.resetPassword);
router.post("/reset-password-with-current", authValidators_1.validateResetPasswordWithCurrent, authController_1.default.resetPasswordWithCurrent);
exports.default = router;
