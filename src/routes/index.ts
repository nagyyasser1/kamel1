import { Router } from "express";
import userRoutes from "./userRoutes";
import reportRoutes from "./report.routes";
import authRoutes from "./authRoutes";
import accountsRoutes from "./accountsRoutes";
import categoryRoutes from "./categoryRoutes";
import productTransactionRoutes from "./productTransactionRoutes";
import transactionsRoutes from "./transactoinsRoutes";
import categoryService from "../services/categoryService";
import accountsService from "../services/accountsService";
import altahlilAlmaliuController from "../controllers/reports/altahlilAlmaliuController";
import altaghayurFiHuquqAlmalakih from "../controllers/reports/altaghayurFiHuquqAlmalakih";
import altadafuqAlnaqdiuCtl from "../controllers/reports/altadafuqAlnaqdiuCtl";
import qayimat_aldakhlController from "../controllers/reports/qayimatAldakhlController";
import mizanAlmarajieihController from "../controllers/reports/mizanAlmarajieihController";
import almizanihAleumumihController from "../controllers/reports/almizanihAleumumihController";

const router = Router();

// testing
router.get("/categories", async (req, res) => {
  const result = await categoryService.getCategoriesBalances();
  res.send(result);
});

router.get("/categories/:number", async (req, res) => {
  const { number } = req.params;
  const result = await categoryService.getCategoryBalance(number);
  res.send(result);
});

router.get("/accountsarray", async (req, res) => {
  const result = await accountsService.getAccountsBalances();
  res.send(result);
});

router.get("/test/account/:number", async (req, res) => {
  const { number } = req.params;

  const result = await accountsService.getAccountBalance(number);

  res.send(result);
});

router.get("/account-all-transactions/:number", async (req, res) => {
  const { number } = req.params;
  const result = await accountsService.getAccountTransactions(number);
  res.send(result);
});

// main api endpoints
router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
router.use("/users", userRoutes);
router.use("/reports", reportRoutes);
router.use("/category", categoryRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/product-transaction", productTransactionRoutes);

// reports ( pages )
router.get("/daftar-aliaistadh", mizanAlmarajieihController);
router.get("/mizan-almarajieih", mizanAlmarajieihController);
router.get("/almizanih-aleumumih", almizanihAleumumihController);
router.get("/qayimat-aldakhl", qayimat_aldakhlController);
router.get("/altahlil-almaliu", altahlilAlmaliuController);
router.get("/altaghayur-fi-huquq-almalakih", altaghayurFiHuquqAlmalakih);
router.get("/altadafuq-alnaqdiu", altadafuqAlnaqdiuCtl);

export default router;
