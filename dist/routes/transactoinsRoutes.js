"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = __importDefault(require("../controllers/transactionsController"));
const transactionsValidators_1 = require("../utils/validations/transactionsValidators");
const router = (0, express_1.Router)();
router.post("/", transactionsValidators_1.validateCreateTransaction, transactionsController_1.default.createTransactionCtr);
router.get("/", transactionsController_1.default.getAllTransactionsCtr);
router.get("/day", transactionsController_1.default.getAllTransactionsCtrByDay);
router.get("/:id", transactionsController_1.default.getTransactionByIdCtr);
router.patch("/:id", transactionsValidators_1.validateUpdateTransaction, transactionsController_1.default.updateTransactionCtr);
router.delete("/:id", transactionsController_1.default.deleteTransactionCtr);
router.delete("/", transactionsController_1.default.deleteTransactionsCtr);
exports.default = router;
