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
const statusCodes_1 = require("../constants/statusCodes");
const accountsService_1 = __importDefault(require("../services/accountsService"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const entryExists_util_1 = __importDefault(require("../utils/entryExists.util"));
const enums_1 = require("../utils/enums");
const createAccountCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const categroyExists = yield (0, entryExists_util_1.default)(enums_1.EntryType.category, (_a = req.body) === null || _a === void 0 ? void 0 : _a.categoryId);
        if (!categroyExists) {
            throw new CustomError_1.default(`category with id:${(_b = req.body) === null || _b === void 0 ? void 0 : _b.categoryId} not found!.`, statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        const existingAccount = yield accountsService_1.default.getAccountByName((_c = req.body) === null || _c === void 0 ? void 0 : _c.name);
        if (existingAccount) {
            throw new CustomError_1.default(`Account with name ${existingAccount.name} aready exists!.`, statusCodes_1.STATUS_CODES.CONFLICT);
        }
        const existingAccountByNumber = yield accountsService_1.default.getAccountByNumber((_d = req.body) === null || _d === void 0 ? void 0 : _d.number);
        if (existingAccountByNumber) {
            throw new CustomError_1.default(`Account with number ${existingAccountByNumber.number} aready exists!.`, statusCodes_1.STATUS_CODES.CONFLICT);
        }
        const account = yield accountsService_1.default.createAccount(req.body);
        res.status(statusCodes_1.STATUS_CODES.CREATED).json(account);
    }
    catch (error) {
        next(error);
    }
});
const deleteAccountCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield accountsService_1.default.deleteAccount(id);
        res.status(statusCodes_1.STATUS_CODES.NO_CONTENT).send();
    }
    catch (error) {
        next(error);
    }
});
const getAllAccountsCtr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categroyId, name } = req.query;
        const accounts = yield accountsService_1.default.getAllAccounts(categroyId, name);
        res.status(statusCodes_1.STATUS_CODES.OK).json(accounts);
    }
    catch (error) {
        next(error);
    }
});
const getAccountById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const account = yield accountsService_1.default.getAccountById((_e = req.params) === null || _e === void 0 ? void 0 : _e.id);
        if (!account) {
            throw new CustomError_1.default(`account with id:${(_f = req.params) === null || _f === void 0 ? void 0 : _f.id} not found`, statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
        res.status(statusCodes_1.STATUS_CODES.OK).send(account);
    }
    catch (error) {
        next(error);
    }
});
const getAllAccountsNumsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield accountsService_1.default.getAllAccountsNums();
        res.send(result);
    }
    catch (error) {
        next(error);
    }
});
const getAccountsBalances = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountsObject } = yield accountsService_1.default.getAccountsBalances();
        const accountsArray = Object.values(accountsObject);
        res.send(accountsArray);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createAccountCtr,
    deleteAccountCtr,
    getAllAccountsCtr,
    getAccountById,
    getAllAccountsNumsController,
    getAccountsBalances,
};
