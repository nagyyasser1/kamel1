import { Router } from "express";
import reportController from "../controllers/report.controller";
import reportValidators from "../utils/validations/report.validators";

const router = Router();

router.post(
  "/",
  reportValidators.validateCreateReport,
  reportController.createReport
);
router.get("/", reportController.getReports);
router.get("/:id", reportController.getReportById);
router.patch("/:id", reportController.updateReport);
router.delete("/:id", reportController.deleteReport);

export default router;
