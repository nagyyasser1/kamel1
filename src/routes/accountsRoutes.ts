import { Router } from "express";
import accountsController from "../controllers/accountsController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import {
  validateCreateAccount,
  validateUpdateAccount,
} from "../utils/validations/accountsValidators";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.post("/", validateCreateAccount, accountsController.createAccountCtr);
router.get("/", accountsController.getAllAccountsCtr);
router.get("/:id", accountsController.getAccountByIdCtr);
router.patch(
  "/:id",
  validateUpdateAccount,
  accountsController.updateAccountCtr
);
router.delete("/:id", accountsController.deleteAccountCtr);

export default router;
