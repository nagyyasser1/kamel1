"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const statusCodes_1 = require("../constants/statusCodes");
const transactionsService = __importStar(require("../services/transactionsService"));
const prisma_1 = __importDefault(require("../prisma"));
const createTransactionCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const fromAccount = yield prisma_1.default.account.findUnique({
            where: { id: req.body.fromId },
        });
        const toAccount = yield prisma_1.default.account.findUnique({
            where: { id: req.body.toId },
        });
        if (!fromAccount) {
            return res.status(statusCodes_1.STATUS_CODES.NOT_FOUND).json({
                message: `Account with id ${req.body.fromId} does not exist`,
            });
        }
        if (!toAccount) {
            return res.status(statusCodes_1.STATUS_CODES.NOT_FOUND).json({
                message: `Account with id ${req.body.toId} does not exist`,
            });
        }
        const existingTransactionNum = yield transactionsService.getTransactionByNum((_a = req.body) === null || _a === void 0 ? void 0 : _a.number);
        if (existingTransactionNum) {
            return res.status(statusCodes_1.STATUS_CODES.CONFLICT).json({
                message: `Transaction with number ${(_b = req.body) === null || _b === void 0 ? void 0 : _b.number} aready exists!`,
            });
        }
        const transaction = yield transactionsService.createTransaction(req.body);
        res.status(statusCodes_1.STATUS_CODES.CREATED).json(transaction);
    }
    catch (error) {
        next(error);
    }
});
const updateTransactionCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const transaction = yield transactionsService.updateTransaction(id, req.body);
        res.status(statusCodes_1.STATUS_CODES.OK).json(transaction);
    }
    catch (error) {
        next(error);
    }
});
const deleteTransactionCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield transactionsService.deleteTransaction(id);
        res.status(statusCodes_1.STATUS_CODES.NO_CONTENT).send();
    }
    catch (error) {
        next(error);
    }
});
const deleteTransactionsCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transactionsService.deleteTransactions();
        res.status(statusCodes_1.STATUS_CODES.NO_CONTENT).send();
    }
    catch (error) {
        next(error);
    }
});
const getAllTransactionsCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transactionsService.getAllTransactions();
        res.status(statusCodes_1.STATUS_CODES.OK).json(transactions);
    }
    catch (error) {
        next(error);
    }
});
const getAllTransactionsCtrByDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transactionsService.getAllTransactionsByDay();
        res.status(statusCodes_1.STATUS_CODES.OK).json(transactions);
    }
    catch (error) {
        next(error);
    }
});
const getTransactionByIdCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const transaction = yield transactionsService.getTransactionById(id);
        if (transaction) {
            res.status(statusCodes_1.STATUS_CODES.OK).json(transaction);
        }
        else {
            res
                .status(statusCodes_1.STATUS_CODES.NOT_FOUND)
                .json({ message: "Transaction not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createTransactionCtr,
    updateTransactionCtr,
    deleteTransactionCtr,
    getAllTransactionsCtr,
    getTransactionByIdCtr,
    getAllTransactionsCtrByDay,
    deleteTransactionsCtr,
};
