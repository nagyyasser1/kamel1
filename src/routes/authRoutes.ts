import { Router } from "express";
import authController from "../controllers/authController";
import {
  validateForgotPassword,
  validateResetPassword,
  validateSignIn,
  validateSignUp,
} from "../utils/validations/authValidators";

const router = Router();

router.post("/signUp", validateSignUp, authController.signUp);
router.post("/signIn", validateSignIn, authController.signIn);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);

export default router;
