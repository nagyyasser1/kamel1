"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMonthRange(year, month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
}
exports.default = getMonthRange;
