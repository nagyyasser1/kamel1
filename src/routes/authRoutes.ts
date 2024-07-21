import { Router } from "express";
import authController from "../controllers/authController";
import {
  validateForgotPassword,
  validateResetPassword,
  validateResetPasswordWithCurrent,
  validateSignIn,
  validateSignUp,
  validateVerifyResetCode,
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
  "/verify-reset-code",
  validateVerifyResetCode,
  authController.verifyResetCode
);
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword
);
router.post(
  "/reset-password-with-current",
  validateResetPasswordWithCurrent,
  authController.resetPasswordWithCurrent
);

export default router;
