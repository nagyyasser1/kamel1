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
const getCurrentYear_1 = __importDefault(require("../utils/getCurrentYear"));
const prisma_1 = __importDefault(require("../prisma"));
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.account.create({
        data,
    });
});
const deleteAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.account.delete({
        where: { id },
    });
});
const getAllAccounts = (categoryId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {};
    if (categoryId) {
        where.categoryId = categoryId;
    }
    if (name && name.trim() !== "") {
        where.name = {
            contains: name,
            mode: "insensitive",
        };
    }
    return yield prisma_1.default.account.findMany({
        where,
        include: {
            category: true,
        },
    });
});
const getAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.account.findUnique({
        where: { id },
        include: {
            category: true,
            sentTransactions: true,
            receivedTransactions: true,
        },
    });
});
const getAccountByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.account.findUnique({
        where: { name },
    });
});
const getAccountByNumber = (number) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.account.findUnique({
        where: { number },
    });
});
function getCategoryTransactionSummary(year) {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield prisma_1.default.category.findMany({
            where: {
                accounts: {
                    some: {},
                },
            },
            include: {
                accounts: {
                    include: {
                        sentTransactions: {
                            where: {
                                OR: [
                                    {
                                        createdAt: {
                                            gte: new Date(`${year}-01-01`),
                                            lt: new Date(`${year + 1}-01-01`),
                                        },
                                    },
                                    {
                                        createdAt: {
                                            lt: new Date(`${year}-01-01`),
                                        },
                                    },
                                ],
                            },
                        },
                        receivedTransactions: {
                            where: {
                                OR: [
                                    {
                                        createdAt: {
                                            gte: new Date(`${year}-01-01`),
                                            lt: new Date(`${year + 1}-01-01`),
                                        },
                                    },
                                    {
                                        createdAt: {
                                            lt: new Date(`${year}-01-01`),
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        });
        const summary = categories.map((category) => {
            const monthlySummary = Array.from({ length: 12 }, (_, index) => ({
                month: index + 1,
                totalSentTransactions: 0,
                totalReceivedTransactions: 0,
                totalSentAmount: BigInt(0),
                totalReceivedAmount: BigInt(0),
            }));
            let totalSentTransactions = 0;
            let totalReceivedTransactions = 0;
            let totalSentAmount = BigInt(0);
            let totalReceivedAmount = BigInt(0);
            let allPreviousSentTransactions = 0;
            let allPreviousReceivedTransactions = 0;
            let allPreviousSentAmount = BigInt(0);
            let allPreviousReceivedAmount = BigInt(0);
            category.accounts.forEach((account) => {
                account.sentTransactions.forEach((transaction) => {
                    const transactionYear = transaction.createdAt.getFullYear();
                    const month = transaction.createdAt.getMonth();
                    if (transactionYear === year) {
                        monthlySummary[month].totalSentTransactions += 1;
                        monthlySummary[month].totalSentAmount += BigInt(transaction.amount);
                        totalSentTransactions += 1;
                        totalSentAmount += BigInt(transaction.amount);
                    }
                    else if (transactionYear < year) {
                        allPreviousSentTransactions += 1;
                        allPreviousSentAmount += BigInt(transaction.amount);
                    }
                });
                account.receivedTransactions.forEach((transaction) => {
                    const transactionYear = transaction.createdAt.getFullYear();
                    const month = transaction.createdAt.getMonth();
                    if (transactionYear === year) {
                        monthlySummary[month].totalReceivedTransactions += 1;
                        monthlySummary[month].totalReceivedAmount += BigInt(transaction.amount);
                        totalReceivedTransactions += 1;
                        totalReceivedAmount += BigInt(transaction.amount);
                    }
                    else if (transactionYear < year) {
                        allPreviousReceivedTransactions += 1;
                        allPreviousReceivedAmount += BigInt(transaction.amount);
                    }
                });
            });
            return {
                categoryId: category.id,
                categoryName: category.name,
                totalSentTransactions,
                totalReceivedTransactions,
                totalSentAmount: Number(totalSentAmount),
                totalReceivedAmount: Number(totalReceivedAmount),
                allPreviousSentTransactions,
                allPreviousReceivedTransactions,
                allPreviousSentAmount: Number(allPreviousSentAmount),
                allPreviousReceivedAmount: Number(allPreviousReceivedAmount),
                monthlySummary: monthlySummary.map((monthData) => (Object.assign(Object.assign({}, monthData), { totalSentAmount: Number(monthData.totalSentAmount), totalReceivedAmount: Number(monthData.totalReceivedAmount) }))),
            };
        });
        return summary;
    });
}
function getTransactionsSummaryForArrayOfAccountsNumber(accountNums) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const thisYearStart = new Date(now.getFullYear(), 0, 1);
        const summaries = yield Promise.all(accountNums.map((accountNum) => __awaiter(this, void 0, void 0, function* () {
            const account = yield prisma_1.default.account.findUnique({
                where: { number: accountNum },
                include: {
                    sentTransactions: true,
                    receivedTransactions: true,
                },
            });
            if (!account) {
                return null;
            }
            const thisYearSent = yield prisma_1.default.transaction.aggregate({
                where: {
                    fromId: account.id,
                    createdAt: {
                        gte: thisYearStart,
                    },
                },
                _sum: {
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });
            const thisYearReceived = yield prisma_1.default.transaction.aggregate({
                where: {
                    toId: account.id,
                    createdAt: {
                        gte: thisYearStart,
                    },
                },
                _sum: {
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });
            const previousYearsSent = yield prisma_1.default.transaction.aggregate({
                where: {
                    fromId: account.id,
                    createdAt: {
                        lt: thisYearStart,
                    },
                },
                _sum: {
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });
            const previousYearsReceived = yield prisma_1.default.transaction.aggregate({
                where: {
                    toId: account.id,
                    createdAt: {
                        lt: thisYearStart,
                    },
                },
                _sum: {
                    amount: true,
                },
                _count: {
                    id: true,
                },
            });
            const thisYearBalance = (thisYearReceived._sum.amount || 0) - (thisYearSent._sum.amount || 0);
            const previousYearsBalance = (previousYearsReceived._sum.amount || 0) -
                (previousYearsSent._sum.amount || 0);
            const totalBalance = thisYearBalance + previousYearsBalance;
            return {
                id: account.id,
                accountName: account.name,
                accountCode: account.number,
                totalBalance: totalBalance,
                thisYear: {
                    totalSentTransactions: thisYearSent._count.id || 0,
                    totalSentAmount: thisYearSent._sum.amount || 0,
                    totalReceivedTransactions: thisYearReceived._count.id || 0,
                    totalReceivedAmount: thisYearReceived._sum.amount || 0,
                    balance: thisYearBalance,
                },
                previousYears: {
                    totalSentTransactions: previousYearsSent._count.id || 0,
                    totalSentAmount: previousYearsSent._sum.amount || 0,
                    totalReceivedTransactions: previousYearsReceived._count.id || 0,
                    totalReceivedAmount: previousYearsReceived._sum.amount || 0,
                    balance: previousYearsBalance,
                },
            };
        })));
        return summaries.filter((summary) => summary !== null);
    });
}
const getAccountsBalances = () => __awaiter(void 0, void 0, void 0, function* () {
    const { startOfYear, endOfYear, previousStartOfYear, previousEndOfYear } = (0, getCurrentYear_1.default)();
    const accounts = yield prisma_1.default.account.findMany({
        select: {
            id: true,
            name: true,
            number: true,
            sentTransactions: {
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startOfYear,
                                lte: endOfYear,
                            },
                        },
                        {
                            createdAt: {
                                gte: previousStartOfYear,
                                lte: previousEndOfYear,
                            },
                        },
                    ],
                },
                select: {
                    amount: true,
                    createdAt: true,
                },
            },
            receivedTransactions: {
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startOfYear,
                                lte: endOfYear,
                            },
                        },
                        {
                            createdAt: {
                                gte: previousStartOfYear,
                                lte: previousEndOfYear,
                            },
                        },
                    ],
                },
                select: {
                    amount: true,
                    createdAt: true,
                },
            },
        },
    });
    const accountsArray = accounts.map((account) => {
        const currentYearSent = account.sentTransactions
            .filter((transaction) => transaction.createdAt >= startOfYear &&
            transaction.createdAt <= endOfYear)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const previousYearsSent = account.sentTransactions
            .filter((transaction) => transaction.createdAt >= previousStartOfYear &&
            transaction.createdAt <= previousEndOfYear)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const currentYearReceived = account.receivedTransactions
            .filter((transaction) => transaction.createdAt >= startOfYear &&
            transaction.createdAt <= endOfYear)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const previousYearsReceived = account.receivedTransactions
            .filter((transaction) => transaction.createdAt >= previousStartOfYear &&
            transaction.createdAt <= previousEndOfYear)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const currentYearBalance = currentYearReceived - currentYearSent;
        const previousYearsBalance = previousYearsReceived - previousYearsSent;
        const totalBalance = currentYearBalance + previousYearsBalance;
        return {
            id: account.id,
            name: account.name,
            number: account.number,
            balance: totalBalance || 0,
            currentYear: {
                balance: currentYearBalance || 0,
                currentYearReceived: currentYearReceived || 0,
                currentYearSent: currentYearSent || 0,
            },
            previousYears: {
                balance: previousYearsBalance || 0,
                previousYearsReceived: previousYearsReceived || 0,
                previousYearsSent: previousYearsSent || 0,
            },
        };
    });
    const accountsObject = accountsArray.reduce((acc, account) => {
        if (account) {
            acc[account === null || account === void 0 ? void 0 : account.number] = account;
        }
        return acc;
    }, {});
    return { accountsObject };
});
const getAccountBalance = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear, startOfYear } = (0, getCurrentYear_1.default)();
    const account = yield prisma_1.default.account.findUnique({
        where: { number: accountNumber },
        select: {
            id: true,
            name: true,
            sentTransactions: {
                select: {
                    amount: true,
                    createdAt: true,
                },
            },
            receivedTransactions: {
                select: {
                    amount: true,
                    createdAt: true,
                },
            },
        },
    });
    if (!account) {
        console.log(`Account with number ${accountNumber} not found`);
        return {
            id: "",
            name: "",
            balance: 0,
            currentYear: {
                balance: 0,
                thisYearReceived: 0,
                thisYearSent: 0,
            },
            previousYears: {
                balance: 0,
                previousYearsReceived: 0,
                previousYearsSent: 0,
            },
        };
    }
    let thisYearSent = 0;
    let thisYearReceived = 0;
    let previousYearsSent = 0;
    let previousYearsReceived = 0;
    account === null || account === void 0 ? void 0 : account.sentTransactions.forEach((transaction) => {
        if (transaction.createdAt >= startOfYear) {
            thisYearSent += transaction.amount;
        }
        else {
            previousYearsSent += transaction.amount;
        }
    });
    account === null || account === void 0 ? void 0 : account.receivedTransactions.forEach((transaction) => {
        if (transaction.createdAt >= startOfYear) {
            thisYearReceived += transaction.amount;
        }
        else {
            previousYearsReceived += transaction.amount;
        }
    });
    const thisYearBalance = thisYearReceived - thisYearSent;
    const previousYearsBalance = previousYearsReceived - previousYearsSent;
    const totalBalance = thisYearBalance + previousYearsBalance;
    return {
        id: account.id || "",
        name: account.name || "",
        balance: totalBalance || 0,
        currentYear: {
            balance: thisYearBalance || 0,
            thisYearReceived: thisYearReceived || 0,
            thisYearSent: thisYearSent || 0,
        },
        previousYears: {
            balance: previousYearsBalance || 0,
            previousYearsReceived: previousYearsReceived || 0,
            previousYearsSent: previousYearsSent || 0,
        },
    };
});
const getAllAccountsNums = () => __awaiter(void 0, void 0, void 0, function* () {
    const accounts = yield prisma_1.default.account.findMany({
        select: {
            name: true,
            number: true,
        },
    });
    return accounts;
});
const getAccountTransactions = (number) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield prisma_1.default.account.findMany({
        where: {
            number,
        },
        include: {
            sentTransactions: true,
            receivedTransactions: true,
        },
    });
    return account;
});
exports.default = {
    getAccountBalance,
    getAccountsBalances,
    getAllAccounts,
    getCategoryTransactionSummary,
    getAllAccountsNums,
    getTransactionsSummaryForArrayOfAccountsNumber,
    getAccountById,
    createAccount,
    deleteAccount,
    getAccountByName,
    getAccountByNumber,
    getAccountTransactions,
};
