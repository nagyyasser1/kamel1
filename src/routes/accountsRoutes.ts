import { Router } from "express";
import accountsController from "../controllers/accountsController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import { validateCreateAccount } from "../utils/validations/accountsValidators";

const router = Router();

// router.use(authMiddleware);
router.get("/", accountsController.getAllAccountsCtr);

// router.use(authorizeMiddleware(USER_ROLES.ADMIN));
router.post("/", validateCreateAccount, accountsController.createAccountCtr);
router.get("/stats", accountsController.getTransactionsSummaryForCategories);
router.get("/:id", accountsController.getAccountById);
router.delete("/:id", accountsController.deleteAccountCtr);

export default router;
