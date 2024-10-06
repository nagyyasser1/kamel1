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
const productTransaction_service_1 = __importDefault(require("../services/productTransaction.service"));
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield productTransaction_service_1.default.createTransaction(req.body);
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create transaction" });
    }
});
const getAllTransactions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield productTransaction_service_1.default.getAllTransactions();
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
const getTransactionsByProductId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield productTransaction_service_1.default.getTransactionsByProductId(req.params.productId);
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTransaction = yield productTransaction_service_1.default.updateTransaction(req.params.id, req.body.income, req.body.outcome);
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update transaction" });
    }
});
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productTransaction_service_1.default.deleteTransaction(req.params.id);
        res.status(204).json();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});
const getStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield productTransaction_service_1.default.getProductBalance();
        res.send(stats);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createTransaction,
    getAllTransactions,
    getTransactionsByProductId,
    updateTransaction,
    deleteTransaction,
    getStats,
};
