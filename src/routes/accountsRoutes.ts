import { Router } from "express";
import accountsController from "../controllers/accountsController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import { validateCreateAccount } from "../utils/validations/accountsValidators";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.post("/", validateCreateAccount, accountsController.createAccountCtr);
router.get("/", accountsController.getAllAccountsCtr);
router.get("/stats", accountsController.getTransactionsSummary);
router.get(
  "/stats/account/:id",
  accountsController.getTransactionsSummaryForAccount
);
router.get(
  "/stats/category/:id",
  accountsController.getTransactionsSummaryForCategory
);
router.get("/:id", accountsController.getAccountById);
router.delete("/:id", accountsController.deleteAccountCtr);

export default router;
