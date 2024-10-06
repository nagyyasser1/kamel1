"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("../constants/statusCodes");
const authorizeMiddleware = (allowedRole) => (req, res, next) => {
    const user = res.locals;
    if (!user || user.role !== allowedRole) {
        return res.status(statusCodes_1.STATUS_CODES.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
};
exports.default = authorizeMiddleware;
