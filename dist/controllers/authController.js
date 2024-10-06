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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../services/userService"));
const appConfig_1 = __importDefault(require("../config/appConfig"));
const statusCodes_1 = require("../constants/statusCodes");
const userRoles_1 = require("../constants/userRoles");
const mailer_1 = require("../lib/mailer");
const mailConfig_1 = __importDefault(require("../config/mailConfig"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const verifiedCodes = {};
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userService_1.default.getUserByEmail(email);
        if (!user) {
            throw new CustomError_1.default("Email not found", statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
                .json({ error: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, appConfig_1.default.jwtSecret, { expiresIn: "7d" });
        res.status(statusCodes_1.STATUS_CODES.OK).json({
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                phone: user.phone,
            },
            access_token: token,
        });
    }
    catch (error) {
        next(error);
    }
});
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password } = req.body;
    try {
        const usersCount = yield userService_1.default.countExistingUsers();
        if (usersCount > 0) {
            throw new CustomError_1.default("An admin user already exists.", statusCodes_1.STATUS_CODES.FORBIDDEN);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, appConfig_1.default.bcryptSalt);
        const newUser = yield userService_1.default.createUser({
            name,
            phone,
            role: userRoles_1.USER_ROLES.ADMIN,
            email,
            password: hashedPassword,
        });
        res.status(statusCodes_1.STATUS_CODES.CREATED).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield userService_1.default.getUserByEmail(email);
        if (!user) {
            throw new CustomError_1.default("User with this email not found.", statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
        yield userService_1.default.savePasswordResetToken(user.id, resetToken);
        try {
            yield (0, mailer_1.sendMail)({
                from: mailConfig_1.default.user,
                to: user.email,
                subject: "Ghazala Password Reset Code",
                text: `Your password reset code is: ${resetToken}`,
                html: `<p>Your password reset code is: <strong>${resetToken}</strong></p>`,
            });
            res
                .status(statusCodes_1.STATUS_CODES.OK)
                .json({ message: "Password reset code sent to your email." });
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        next(error);
    }
});
const verifyResetCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    try {
        const user = yield userService_1.default.getUserByEmail(email);
        if (!user) {
            throw new CustomError_1.default("User with this email not found.", statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        const isTokenValid = yield userService_1.default.verifyPasswordResetToken(user.id, code);
        if (!isTokenValid) {
            return res
                .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
                .json({ error: "Invalid or expired password reset token." });
        }
        verifiedCodes[email] = code;
        res.status(statusCodes_1.STATUS_CODES.OK).json({ message: "Reset code verified." });
    }
    catch (error) {
        next(error);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code, newPassword } = req.body;
    try {
        const user = yield userService_1.default.getUserByEmail(email);
        if (!user) {
            throw new CustomError_1.default("User with this email not found.", statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        if (verifiedCodes[email] !== code) {
            return res
                .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
                .json({ error: "Code not verified or expired." });
        }
        delete verifiedCodes[email];
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, appConfig_1.default.bcryptSalt);
        yield userService_1.default.updateUser(user.id, { password: hashedPassword });
        res
            .status(statusCodes_1.STATUS_CODES.OK)
            .json({ message: "Password reset successfully." });
    }
    catch (error) {
        next(error);
    }
});
const resetPasswordWithCurrent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword } = req.body;
    try {
        const user = yield userService_1.default.getUserByEmail(email);
        if (!user) {
            throw new CustomError_1.default("User with this email not found.", statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res
                .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
                .json({ error: "Current password is incorrect." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, appConfig_1.default.bcryptSalt);
        yield userService_1.default.updateUser(user.id, { password: hashedPassword });
        res
            .status(statusCodes_1.STATUS_CODES.OK)
            .json({ message: "Password reset successfully." });
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    signIn,
    signUp,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    resetPasswordWithCurrent,
};
