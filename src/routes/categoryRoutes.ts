import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { validateCreateCategory } from "../utils/validations/categoryValidators";
import authMiddleware from "../middlewares/authMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));
router.post("/", validateCreateCategory, createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
