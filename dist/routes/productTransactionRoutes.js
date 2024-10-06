"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const proTransactionValidators_1 = __importDefault(require("../utils/validations/proTransactionValidators"));
const productTransaction_controller_1 = __importDefault(require("../controllers/productTransaction.controller"));
router.post("/", proTransactionValidators_1.default.validateCreateProductTrans, productTransaction_controller_1.default.createTransaction);
router.get("/", productTransaction_controller_1.default.getAllTransactions);
router.get("/stats", productTransaction_controller_1.default.getStats);
router.get("/:id", productTransaction_controller_1.default.getTransactionsByProductId);
router.patch("/:id", productTransaction_controller_1.default.updateTransaction);
router.delete("/:id", productTransaction_controller_1.default.deleteTransaction);
exports.default = router;
