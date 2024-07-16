import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().required(),
  code: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const validateSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate user data
  const result: ValidationResult = signUpSchema.validate(
    req.body,
    { abortEarly: false } // Return all errors
  );

  // If errors, return error response
  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  // If no errors, continue to next handler
  next();
};

export const validateSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate user data
  const result: ValidationResult = signInSchema.validate(
    req.body,
    { abortEarly: false } // Return all errors
  );

  // If errors, return error response
  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  // If no errors, continue to next handler
  next();
};

export const validateForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = forgotPasswordSchema.validate(
    req.body,
    { abortEarly: false } // Return all errors
  );

  // If errors, return error response
  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  next();
};

export const validateResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = resetPasswordSchema.validate(
    req.body,
    { abortEarly: false } // Return all errors
  );

  // If errors, return error response
  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  next();
};
