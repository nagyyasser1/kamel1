import { Router } from "express";
const router = Router();

import proTransactionValidators from "../utils/validations/proTransactionValidators";
import productTransactionController from "../controllers/productTransaction.controller";

router.post(
  "/",
  proTransactionValidators.validateCreateProductTrans,
  productTransactionController.createTransaction
);
router.get("/", productTransactionController.getAllTransactions);
router.get("/:id", productTransactionController.getTransactionsByProductId);
router.patch("/:id", productTransactionController.updateTransaction);
router.delete("/:id", productTransactionController.deleteTransaction);

export default router;
