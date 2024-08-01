import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import accountsRoutes from "./accountsRoutes";
import categoryRoutes from "./categoryRoutes";
import transactionsRoutes from "./transactoinsRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/accounts", accountsRoutes);
router.use("/category", categoryRoutes);
router.use("/transactions", transactionsRoutes);

export default router;
