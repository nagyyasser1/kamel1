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
const productTransaction_model_1 = __importDefault(require("../models/productTransaction.model"));
const prisma_1 = __importDefault(require("../prisma"));
const createTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productTransaction_model_1.default.createTransaction(data);
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productTransaction_model_1.default.getAllTransactions();
});
const getTransactionsByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productTransaction_model_1.default.getTransactionsByProductId(productId);
});
const updateTransaction = (id, income, outcome) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productTransaction_model_1.default.updateTransaction(id, income, outcome);
});
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productTransaction_model_1.default.deleteTransaction(id);
});
function getProductBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        const thisYearStart = new Date(today.getFullYear(), 0, 1, 0, 0, 0);
        const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59);
        const allAccounts = yield prisma_1.default.account.findMany({
            where: {
                ProductTransaction: {
                    some: {},
                },
            },
            select: {
                id: true,
                name: true,
                number: true,
            },
        });
        const todayTransactions = yield prisma_1.default.productTransaction.findMany({
            where: {
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
            select: {
                accountId: true,
                income: true,
                outcome: true,
            },
        });
        const yearToYesterdayTransactions = yield prisma_1.default.productTransaction.findMany({
            where: {
                createdAt: {
                    gte: thisYearStart,
                    lte: yesterdayEnd,
                },
            },
            select: {
                accountId: true,
                income: true,
                outcome: true,
            },
        });
        const allYearTransactions = yield prisma_1.default.productTransaction.findMany({
            where: {
                createdAt: {
                    gte: thisYearStart,
                },
            },
            select: {
                accountId: true,
                income: true,
                outcome: true,
            },
        });
        const lastYearTransactions = yield prisma_1.default.productTransaction.findMany({
            where: {
                createdAt: {
                    lt: thisYearStart,
                },
            },
            select: {
                accountId: true,
                income: true,
                outcome: true,
            },
        });
        const calculateTotals = (transactions) => {
            return transactions.reduce((totals, txn) => {
                totals.income += txn.income || 0;
                totals.outcome += txn.outcome || 0;
                return totals;
            }, { income: 0, outcome: 0 });
        };
        const groupedResults = allAccounts.map((account) => {
            const accountId = account.id;
            const todayTotals = calculateTotals(todayTransactions.filter((txn) => txn.accountId === accountId));
            const yearToYesterdayTotals = calculateTotals(yearToYesterdayTransactions.filter((txn) => txn.accountId === accountId));
            const allYearTotals = calculateTotals(allYearTransactions.filter((txn) => txn.accountId === accountId));
            const lastYearTotals = calculateTotals(lastYearTransactions.filter((txn) => txn.accountId === accountId));
            return {
                id: account.id,
                name: account.name,
                number: account.number,
                current: {
                    income: todayTotals.income,
                    outcome: todayTotals.outcome,
                    firstBalance: Math.abs(yearToYesterdayTotals.income - yearToYesterdayTotals.outcome),
                    lastBalance: Math.abs(yearToYesterdayTotals.income - yearToYesterdayTotals.outcome) + Math.abs(todayTotals.income - todayTotals.outcome),
                },
                all: {
                    income: allYearTotals.income,
                    outcome: allYearTotals.outcome,
                    firstBalance: Math.abs(lastYearTotals.income - lastYearTotals.outcome),
                    lastBalance: Math.abs(lastYearTotals.income - lastYearTotals.outcome) +
                        Math.abs(allYearTotals.income - allYearTotals.outcome),
                },
            };
        });
        return groupedResults;
    });
}
exports.default = {
    createTransaction,
    getAllTransactions,
    getTransactionsByProductId,
    updateTransaction,
    deleteTransaction,
    getProductBalance,
};
