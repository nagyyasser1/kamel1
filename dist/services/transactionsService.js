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
exports.getAllTransactionsByDay = exports.getTransactionByNum = exports.getTransactionById = exports.getAllTransactions = exports.deleteTransactions = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = void 0;
const getCurrentYear_1 = __importDefault(require("../utils/getCurrentYear"));
const prisma_1 = __importDefault(require("../prisma"));
const createTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.create({
        data,
    });
});
exports.createTransaction = createTransaction;
const updateTransaction = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.update({
        where: { id },
        data,
    });
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.delete({
        where: { id },
    });
});
exports.deleteTransaction = deleteTransaction;
const deleteTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.deleteMany();
});
exports.deleteTransactions = deleteTransactions;
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.findMany({
        include: {
            from: true,
            to: true,
        },
    });
});
exports.getAllTransactions = getAllTransactions;
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.findUnique({
        where: { id },
    });
});
exports.getTransactionById = getTransactionById;
const getTransactionByNum = (number) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.findUnique({
        where: { number },
    });
});
exports.getTransactionByNum = getTransactionByNum;
const getAllTransactionsByDay = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return yield prisma_1.default.transaction.findMany({
        where: {
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            from: true,
            to: true,
        },
    });
});
exports.getAllTransactionsByDay = getAllTransactionsByDay;
const getCategoryBalanceByNumber = (categoryNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear } = (0, getCurrentYear_1.default)();
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            AND: [
                {
                    createdAt: {
                        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
                {
                    OR: [
                        { from: { category: { number: categoryNumber } } },
                        { to: { category: { number: categoryNumber } } },
                    ],
                },
            ],
        },
        select: {
            amount: true,
            from: {
                select: {
                    category: { select: { number: true } },
                },
            },
            to: {
                select: {
                    category: { select: { number: true } },
                },
            },
        },
    });
    const balance = transactions.reduce((acc, transaction) => {
        var _a, _b, _c, _d;
        if (((_b = (_a = transaction.from) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.number) === categoryNumber) {
            acc -= transaction.amount;
        }
        if (((_d = (_c = transaction.to) === null || _c === void 0 ? void 0 : _c.category) === null || _d === void 0 ? void 0 : _d.number) === categoryNumber) {
            acc += transaction.amount;
        }
        return acc;
    }, 0);
    return balance;
});
const getAccountBalanceByNumber = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear } = (0, getCurrentYear_1.default)();
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            AND: [
                {
                    createdAt: {
                        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
                {
                    OR: [
                        { from: { number: accountNumber } },
                        { to: { number: accountNumber } },
                    ],
                },
            ],
        },
        select: {
            amount: true,
            from: { select: { number: true } },
            to: { select: { number: true } },
        },
    });
    const balance = transactions.reduce((acc, transaction) => {
        if (transaction.from.number === accountNumber) {
            acc -= transaction.amount;
        }
        if (transaction.to.number === accountNumber) {
            acc += transaction.amount;
        }
        return acc;
    }, 0);
    return balance;
});
const getAccountsBalanceByNumbers = (accountNumbers) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear } = (0, getCurrentYear_1.default)();
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            createdAt: {
                gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
            },
        },
        select: {
            amount: true,
            from: { select: { number: true } },
            to: { select: { number: true } },
        },
    });
    const balance = transactions.reduce((acc, transaction) => {
        if (accountNumbers.includes(transaction.from.number)) {
            acc -= transaction.amount;
        }
        if (accountNumbers.includes(transaction.to.number)) {
            acc += transaction.amount;
        }
        return acc;
    }, 0);
    return balance;
});
const getCategoriesBalance = (categoryNumbers) => __awaiter(void 0, void 0, void 0, function* () {
    const accounts = yield prisma_1.default.account.findMany({
        where: {
            category: { number: { in: categoryNumbers } },
        },
        select: {
            number: true,
        },
    });
    const accountNumbers = accounts.map((account) => account.number);
    if (accountNumbers.length === 0) {
        return 0;
    }
    const balance = yield getAccountsBalanceByNumbers(accountNumbers);
    return balance;
});
const getAccountsWithBalance = (accountNumbers) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear } = (0, getCurrentYear_1.default)();
    const accounts = yield prisma_1.default.account.findMany({
        where: {
            number: { in: accountNumbers },
        },
        select: {
            number: true,
            name: true,
        },
    });
    const accountNumbersList = accounts.map((account) => account.number);
    if (accountNumbersList.length === 0) {
        return [];
    }
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            AND: [
                {
                    createdAt: {
                        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
                {
                    OR: [
                        { from: { number: { in: accountNumbersList } } },
                        { to: { number: { in: accountNumbersList } } },
                    ],
                },
            ],
        },
        select: {
            amount: true,
            from: { select: { number: true } },
            to: { select: { number: true } },
        },
    });
    const balances = accounts.map((account) => {
        const accountTransactions = transactions.filter((transaction) => transaction.from.number === account.number ||
            transaction.to.number === account.number);
        const balance = accountTransactions.reduce((acc, transaction) => {
            if (transaction.from.number === account.number) {
                acc -= transaction.amount;
            }
            if (transaction.to.number === account.number) {
                acc += transaction.amount;
            }
            return acc;
        }, 0);
        return {
            number: account.number,
            name: account.name,
            balance,
        };
    });
    return balances;
});
const getCategoriesWithBalance = (categoryNumbers) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear } = (0, getCurrentYear_1.default)();
    const categories = yield prisma_1.default.category.findMany({
        where: {
            number: { in: categoryNumbers },
        },
        select: {
            number: true,
            name: true,
        },
    });
    const categoryNumbersList = categories.map((category) => category.number);
    if (categoryNumbersList.length === 0) {
        return [];
    }
    const accounts = yield prisma_1.default.account.findMany({
        where: {
            category: { number: { in: categoryNumbersList } },
        },
        select: {
            number: true,
            category: {
                select: {
                    number: true,
                },
            },
        },
    });
    const accountNumbersList = accounts.map((account) => account.number);
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            AND: [
                {
                    createdAt: {
                        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
                {
                    OR: [
                        { from: { number: { in: accountNumbersList } } },
                        { to: { number: { in: accountNumbersList } } },
                    ],
                },
            ],
        },
        select: {
            amount: true,
            from: {
                select: { number: true, category: { select: { number: true } } },
            },
            to: { select: { number: true, category: { select: { number: true } } } },
        },
    });
    const balances = categories.map((category) => {
        const categoryAccountNumbers = accounts
            .filter((account) => { var _a; return ((_a = account.category) === null || _a === void 0 ? void 0 : _a.number) === category.number; })
            .map((account) => account.number);
        const categoryTransactions = transactions.filter((transaction) => categoryAccountNumbers.includes(transaction.from.number) ||
            categoryAccountNumbers.includes(transaction.to.number));
        const balance = categoryTransactions.reduce((acc, transaction) => {
            var _a, _b;
            if (((_a = transaction.from.category) === null || _a === void 0 ? void 0 : _a.number) === category.number) {
                acc -= transaction.amount;
            }
            if (((_b = transaction.to.category) === null || _b === void 0 ? void 0 : _b.number) === category.number) {
                acc += transaction.amount;
            }
            return acc;
        }, 0);
        return {
            number: category.number,
            name: category.name,
            balance,
        };
    });
    return balances;
});
exports.default = {
    getCategoryBalanceByNumber,
    getAccountBalanceByNumber,
    getAccountsBalanceByNumbers,
    getAccountsWithBalance,
    getCategoriesBalance,
    getCategoriesWithBalance,
};
