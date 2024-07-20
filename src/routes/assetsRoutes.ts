import authMiddleware from "../middlewares/authMiddleware";
import assetsController from "../controllers/assetsController";
import { validateCreateAsset } from "../utils/validations/assetsValidators";
import { Router } from "express";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));
router.post("/", validateCreateAsset, assetsController.createAssetCtr);
router.get("/", assetsController.getAllAssetsCtr);
router.get("/:id", assetsController.getAssetByIdCtr);
router.patch("/:id", assetsController.updateAssetCtr);
router.delete("/:id", assetsController.deleteAssetCtr);
export default router;
