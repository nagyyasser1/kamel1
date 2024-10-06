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
const report_service_1 = __importDefault(require("../services/report.service"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, description } = req.body;
    try {
        const report = yield report_service_1.default.createReport(type, description);
        return res.status(201).json(report);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to create report", error });
    }
});
const getReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const reports = yield report_service_1.default.getAllReports(type);
        return res.status(200).json(reports);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to get reports", error });
    }
});
const getReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const report = yield report_service_1.default.getReport(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(200).json(report);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to get report", error });
    }
});
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield report_service_1.default.removeReport(id);
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to delete report", error });
    }
});
const updateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { type, description } = req.body;
    try {
        const report = yield report_service_1.default.updateReport(id, type, description);
        return res.status(200).json(report);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to update report", error });
    }
});
exports.default = {
    createReport,
    getReports,
    getReportById,
    deleteReport,
    updateReport,
};
