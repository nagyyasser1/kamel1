import { Router } from "express";
import suppliersController from "../controllers/suppliersController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import {
  validateCreateSupplier,
  validateUpdateSupplier,
} from "../utils/validations/suppliersValidators";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.post("/", validateCreateSupplier, suppliersController.createSupplierCtr);
router.get("/", suppliersController.getAllSuppliersCtr);
router.get("/:id", suppliersController.getSupplierByIdCtr);
router.patch(
  "/:id",
  validateUpdateSupplier,
  suppliersController.updateSupplierCtr
);
router.delete("/:id", suppliersController.deleteSupplierCtr);

export default router;
