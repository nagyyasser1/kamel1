"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sumGroupOfAccounts = (base, target) => {
    const filteredAccounts = base.filter((baseAccount) => target.some((targetAccountCode) => targetAccountCode === baseAccount.accountCode));
    const totalSum = filteredAccounts.reduce((sum, account) => {
        return sum + account.totalBalance;
    }, 0);
    return totalSum;
};
exports.default = sumGroupOfAccounts;
