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
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const accountsRoutes_1 = __importDefault(require("./accountsRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const productTransactionRoutes_1 = __importDefault(require("./productTransactionRoutes"));
const transactoinsRoutes_1 = __importDefault(require("./transactoinsRoutes"));
const categoryService_1 = __importDefault(require("../services/categoryService"));
const accountsService_1 = __importDefault(require("../services/accountsService"));
const altahlilAlmaliuController_1 = __importDefault(require("../controllers/reports/altahlilAlmaliuController"));
const altaghayurFiHuquqAlmalakih_1 = __importDefault(require("../controllers/reports/altaghayurFiHuquqAlmalakih"));
const altadafuqAlnaqdiuCtl_1 = __importDefault(require("../controllers/reports/altadafuqAlnaqdiuCtl"));
const qayimatAldakhlController_1 = __importDefault(require("../controllers/reports/qayimatAldakhlController"));
const mizanAlmarajieihController_1 = __importDefault(require("../controllers/reports/mizanAlmarajieihController"));
const almizanihAleumumihController_1 = __importDefault(require("../controllers/reports/almizanihAleumumihController"));
const router = (0, express_1.Router)();
router.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield categoryService_1.default.getCategoriesBalances();
    res.send(result);
}));
router.get("/categories/:number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number } = req.params;
    const result = yield categoryService_1.default.getCategoryBalance(number);
    res.send(result);
}));
router.get("/accountsarray", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accountsService_1.default.getAccountsBalances();
    res.send(result);
}));
router.get("/test/account/:number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number } = req.params;
    const result = yield accountsService_1.default.getAccountBalance(number);
    res.send(result);
}));
router.get("/account-all-transactions/:number", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { number } = req.params;
    const result = yield accountsService_1.default.getAccountTransactions(number);
    res.send(result);
}));
router.use("/auth", authRoutes_1.default);
router.use("/accounts", accountsRoutes_1.default);
router.use("/users", userRoutes_1.default);
router.use("/reports", report_routes_1.default);
router.use("/category", categoryRoutes_1.default);
router.use("/transactions", transactoinsRoutes_1.default);
router.use("/product-transaction", productTransactionRoutes_1.default);
router.get("/daftar-aliaistadh", mizanAlmarajieihController_1.default);
router.get("/mizan-almarajieih", mizanAlmarajieihController_1.default);
router.get("/almizanih-aleumumih", almizanihAleumumihController_1.default);
router.get("/qayimat-aldakhl", qayimatAldakhlController_1.default);
router.get("/altahlil-almaliu", altahlilAlmaliuController_1.default);
router.get("/altaghayur-fi-huquq-almalakih", altaghayurFiHuquqAlmalakih_1.default);
router.get("/altadafuq-alnaqdiu", altadafuqAlnaqdiuCtl_1.default);
exports.default = router;
