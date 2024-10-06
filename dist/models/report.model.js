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
const index_1 = __importDefault(require("../prisma/index"));
const createReport = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield index_1.default.report.create({
        data,
    });
});
const getReports = (type) => __awaiter(void 0, void 0, void 0, function* () {
    let where = {};
    if (type) {
        where.type = type;
    }
    return yield index_1.default.report.findMany({ where });
});
const getReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield index_1.default.report.findUnique({
        where: { id },
    });
});
const deleteReport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield index_1.default.report.delete({
        where: { id },
    });
});
const updateReport = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield index_1.default.report.update({
        where: { id },
        data,
    });
});
exports.default = {
    createReport,
    getReports,
    getReportById,
    deleteReport,
    updateReport,
};
