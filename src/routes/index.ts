import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import accountsRoutes from "./accountsRoutes";
import categoryRoutes from "./categoryRoutes";
import transactionsRoutes from "./transactoinsRoutes";
import categoryService from "../services/categoryService";
import accountsService from "../services/accountsService";
import altahlilAlmaliuController from "../controllers/altahlilAlmaliuController";

const router = Router();

router.get("/categories", async (req, res) => {
  const result = await categoryService.getCategoryBalancesTest();
  res.send(result);
});

// router.get("/categories/:number", async (req, res) => {
//   const { number } = req.params;
//   const result = await categoryService.getSubcategoryBalances(parseInt(number));
//   res.send(result);
// });

// router.get("/accounts", async (req, res) => {
//   const result = await accountsService.getAccountBalances();
//   res.send(result);
// });

router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/transactions", transactionsRoutes);

// التحليل المالي
router.get("/altahlil-almaliu", altahlilAlmaliuController);

export default router;
