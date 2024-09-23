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
import altahlilAlmaliuController from "../controllers/altahlilAlmaliuController";

const router = Router();

router.get("/categories", async (req, res) => {
  const result = await categoryService.getCategoriesBalances();
  res.send(result);
});

router.get("/categories/:number", async (req, res) => {
  const { number } = req.params;
  const result = await categoryService.getCategoryBalance(parseInt(number));
  res.send(result);
});

router.get("/accountsarray", async (req, res) => {
  const result = await accountsService.getAccountsBalances();
  res.send(result);
});

router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
router.use("/users", userRoutes);
router.use("/reports", reportRoutes);
router.use("/category", categoryRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/product-transaction", productTransactionRoutes);

// التحليل المالي
router.get("/altahlil-almaliu", altahlilAlmaliuController);

export default router;
