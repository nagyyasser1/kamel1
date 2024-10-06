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
const enums_1 = require("./enums");
function entryExists(entryType, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let entryExists = false;
        switch (entryType) {
            case enums_1.EntryType.user:
                entryExists = (yield prisma_1.default.user.findUnique({ where: { id } })) !== null;
                break;
            case enums_1.EntryType.account:
                entryExists =
                    (yield prisma_1.default.account.findUnique({ where: { id } })) !== null;
                break;
            case enums_1.EntryType.category:
                entryExists =
                    (yield prisma_1.default.category.findUnique({
                        where: { id },
                    })) !== null;
                break;
            case enums_1.EntryType.transaction:
                entryExists =
                    (yield prisma_1.default.transaction.findUnique({ where: { id } })) !== null;
                break;
            default:
                throw new Error("Invalid entry type");
        }
        return entryExists ? true : false;
    });
}
exports.default = entryExists;
