import { Router } from "express";
import userController from "../controllers/userController";
import {
  validateCreateUser,
  validateQueryUsers,
  validateUpdateUser,
} from "../utils/validations/userValidators";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.get("/", validateQueryUsers, userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", validateCreateUser, userController.createUser);
router.patch("/:id", validateUpdateUser, userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
