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
exports.mizanAlmarajieihController = void 0;
const accountsService_1 = __importDefault(require("../../services/accountsService"));
const statusCodes_1 = require("../../constants/statusCodes");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const mizanAlmarajieihController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year } = req.query;
        if (!year) {
            throw new CustomError_1.default("year query must be provided!", statusCodes_1.STATUS_CODES.BAD_REQUEST);
        }
        const result = yield accountsService_1.default.getCategoryTransactionSummary(Number(year));
        res.send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.mizanAlmarajieihController = mizanAlmarajieihController;
exports.default = exports.mizanAlmarajieihController;
