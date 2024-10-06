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
const prisma_1 = __importDefault(require("../prisma"));
const createTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.productTransaction.create({
        data,
    });
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.productTransaction.findMany({
        include: {
            account: true,
        },
    });
});
const getTransactionsByProductId = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.productTransaction.findMany({
        where: { accountId },
        include: {
            account: true,
        },
    });
});
const updateTransaction = (id, income, outcome) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.productTransaction.update({
        where: { id },
        data: {
            income,
            outcome,
        },
    });
});
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.productTransaction.delete({
        where: { id },
    });
});
exports.default = {
    createTransaction,
    getAllTransactions,
    getTransactionsByProductId,
    updateTransaction,
    deleteTransaction,
};
