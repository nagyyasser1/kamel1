"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCurrentYear = () => {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    const previousYear = currentYear - 1;
    const previousStartOfYear = new Date(previousYear, 0, 1);
    const previousEndOfYear = new Date(previousYear, 11, 31, 23, 59, 59);
    return {
        currentYear,
        startOfYear,
        endOfYear,
        previousStartOfYear,
        previousEndOfYear,
    };
};
exports.default = getCurrentYear;
