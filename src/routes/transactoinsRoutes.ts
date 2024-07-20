import { Router } from "express";
import transactionsController from "../controllers/transactionsController";
import authMiddleware from "../middlewares/authMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from "../utils/validations/transactionsValidators";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.post(
  "/",
  validateCreateTransaction,
  transactionsController.createTransactionCtr
);
router.get("/", transactionsController.getAllTransactionsCtr);
router.get("/:id", transactionsController.getTransactionByIdCtr);
router.patch(
  "/:id",
  validateUpdateTransaction,
  transactionsController.updateTransactionCtr
);
router.delete("/:id", transactionsController.deleteTransactionCtr);

export default router;
