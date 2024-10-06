"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appConfig_1 = __importDefault(require("../config/appConfig"));
const statusCodes_1 = require("../constants/statusCodes");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res
            .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: "No token, authorization denied" });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, appConfig_1.default.jwtSecret);
        res.locals = user;
        next();
    }
    catch (err) {
        res
            .status(statusCodes_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: "Token is not valid" });
    }
};
exports.default = authMiddleware;
