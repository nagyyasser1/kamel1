"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountsController_1 = __importDefault(require("../controllers/accountsController"));
const accountsValidators_1 = require("../utils/validations/accountsValidators");
const router = (0, express_1.Router)();
router.get("/", accountsController_1.default.getAllAccountsCtr);
router.get("/test", accountsController_1.default.getAllAccountsNumsController);
router.get("/accounts-with-balance", accountsController_1.default.getAccountsBalances);
router.post("/", accountsValidators_1.validateCreateAccount, accountsController_1.default.createAccountCtr);
router.get("/:id", accountsController_1.default.getAccountById);
router.delete("/:id", accountsController_1.default.deleteAccountCtr);
exports.default = router;
