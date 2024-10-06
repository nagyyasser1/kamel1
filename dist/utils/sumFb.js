"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sumFpAccounts = (accounts) => {
    let total = 0;
    accounts.forEach((account) => {
        return (total += account.totalBalance);
    });
    return total;
};
exports.default = sumFpAccounts;
