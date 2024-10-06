"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sumGroupOfAccountsWithCustomPercentage = (base, target) => {
    const filteredAccounts = base.filter((baseAccount) => target.some((targetAccount) => targetAccount.accountCode === baseAccount.accountCode));
    const totalSum = filteredAccounts.reduce((sum, account) => {
        const targetAccount = target.find((targetAcc) => targetAcc.accountCode === account.accountCode);
        if (targetAccount) {
            const multiplier = 1 - targetAccount.percentage / 100;
            const reducedBalance = account.totalBalance * multiplier;
            return sum + reducedBalance;
        }
        return sum;
    }, 0);
    return totalSum;
};
exports.default = sumGroupOfAccountsWithCustomPercentage;
