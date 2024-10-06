"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
const report_validators_1 = __importDefault(require("../utils/validations/report.validators"));
const router = (0, express_1.Router)();
router.post("/", report_validators_1.default.validateCreateReport, report_controller_1.default.createReport);
router.get("/", report_controller_1.default.getReports);
router.get("/:id", report_controller_1.default.getReportById);
router.patch("/:id", report_controller_1.default.updateReport);
router.delete("/:id", report_controller_1.default.deleteReport);
exports.default = router;
