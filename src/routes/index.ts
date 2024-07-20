import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import assetsRoutes from "./assetsRoutes";
import clientsRoutes from "./clientsRoutes";
import suppliersRoutes from "./suppliersRoutes";
import accountsRoutes from "./accountsRoutes";
import transactionsRoutes from "./transactoinsRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/assets", assetsRoutes);
router.use("/clients", clientsRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/accounts", accountsRoutes);
router.use("/transactions", transactionsRoutes);

export default router;
