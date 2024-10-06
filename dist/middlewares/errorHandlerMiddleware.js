"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("../constants/statusCodes");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = (err instanceof CustomError_1.default && err.statusCode) ||
        statusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
    res
        .status(statusCode)
        .json({ message: (err === null || err === void 0 ? void 0 : err.message) || "Internal server error !" });
};
exports.default = errorHandler;
