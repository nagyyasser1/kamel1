import { Router } from "express";
import categoryController, {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  categoryStatistics,
  getCategoryTransactionSummary,
} from "../controllers/categoryController";
import { validateCreateCategory } from "../utils/validations/categoryValidators";
import authMiddleware from "../middlewares/authMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";

const router = Router();

// router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));
router.post("/", validateCreateCategory, createCategory);
router.get("/", getCategories);
router.get("/test", categoryController.getCategoriesWithNumsController);
router.get("/stats", getCategoryTransactionSummary);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
