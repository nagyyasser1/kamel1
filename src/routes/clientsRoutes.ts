import { Router } from "express";
import clientsController from "../controllers/clientsController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeMiddleware from "@/middlewares/authorizeMiddleware";
import { USER_ROLES } from "../constants/userRoles";
import { validateCreateClient } from "../utils/validations/clientsValidators";

const router = Router();

router.use(authMiddleware, authorizeMiddleware(USER_ROLES.ADMIN));

router.post("/", validateCreateClient, clientsController.createClientCtr);
router.patch("/:id", clientsController.updateClientCtr);
router.delete("/:id", clientsController.deleteClientCtr);
router.get("/", clientsController.getAllClientsCtr);
router.get("/:id", clientsController.getClientByIdCtr);

export default router;
