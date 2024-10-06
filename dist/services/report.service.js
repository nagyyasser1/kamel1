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
const report_model_1 = __importDefault(require("../models/report.model"));
const createReport = (type, description) => __awaiter(void 0, void 0, void 0, function* () {
    return yield report_model_1.default.createReport({ type, description });
});
const getAllReports = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield report_model_1.default.getReports(type);
});
const getReport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield report_model_1.default.getReportById(id);
});
const removeReport = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield report_model_1.default.deleteReport(id);
});
const updateReport = (id, type, description) => __awaiter(void 0, void 0, void 0, function* () {
    return yield report_model_1.default.updateReport(id, { type, description });
});
exports.default = {
    createReport,
    getAllReports,
    getReport,
    removeReport,
    updateReport,
};
