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
exports.getCategoryTransactionSummary = exports.categoryStatistics = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const categoryService_1 = __importDefault(require("../services/categoryService"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const statusCodes_1 = require("../constants/statusCodes");
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const categoryExists = yield categoryService_1.default.getCategoryByNumber((_a = req.body) === null || _a === void 0 ? void 0 : _a.number);
        if (categoryExists) {
            throw new CustomError_1.default(`asset with ${categoryExists.number} aready exists!.`, statusCodes_1.STATUS_CODES.CONFLICT);
        }
        const category = yield categoryService_1.default.createCategory(req.body);
        res.status(statusCodes_1.STATUS_CODES.CREATED).json(category);
    }
    catch (error) {
        next(error);
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hasAccounts } = req.query;
        let categories;
        if (hasAccounts === "true") {
            categories = yield categoryService_1.default.getCategoryThatHaveAccounts();
        }
        else {
            categories = yield categoryService_1.default.getCategories();
        }
        res.status(statusCodes_1.STATUS_CODES.OK).json(categories);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategories = getCategories;
const getCategoriesWithNumsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield categoryService_1.default.getCategoriesWithNums();
        res.send(result);
    }
    catch (error) {
        next(error);
    }
});
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryService_1.default.getCategoryById(req.params.id);
        if (category) {
            res.json(category);
        }
        else {
            throw new CustomError_1.default(`category not found`, statusCodes_1.STATUS_CODES.NOT_FOUND);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryById = getCategoryById;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryService_1.default.updateCategory(req.params.id, req.body);
        res.json(category);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield categoryService_1.default.deleteCategory(req.params.id);
        res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategory = deleteCategory;
const categoryStatistics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, code } = req.query;
        if (!id && !code)
            return res.status(statusCodes_1.STATUS_CODES.BAD_REQUEST).json({
                message: "id or code must be provided in the query!",
            });
        const categoryId = typeof id === "string" ? id : undefined;
        const categoryCode = typeof code === "string" ? code : undefined;
        if (categoryCode) {
            if (categoryCode) {
                return res.status(statusCodes_1.STATUS_CODES.BAD_REQUEST).json({
                    message: "Invalid code provided. It must be a number.",
                });
            }
        }
        const result = yield categoryService_1.default.getCategoryStatistics(categoryId, categoryCode);
        res.send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.categoryStatistics = categoryStatistics;
const getCategoryTransactionSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, name } = req.query;
        if (!code && !name)
            return res.status(statusCodes_1.STATUS_CODES.BAD_REQUEST).json({
                message: "category 'code' or 'name' must be provided in the query!",
            });
        console.log(code);
        console.log(name);
        const result = yield categoryService_1.default.getCategoryTransactionSummary(code, name);
        res.send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryTransactionSummary = getCategoryTransactionSummary;
exports.default = {
    getCategoriesWithNumsController,
};
