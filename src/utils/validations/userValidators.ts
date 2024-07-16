import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";
import appConfig from "../../config/appConfig";

enum Role {
  ADMIN,
  ACCOUNTANT,
  ADMINISTRATION,
  REVIEWER,
}

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
});

export const queryUsersSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(Role))
    .optional(),
});

export const validateCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate user data
  const result: ValidationResult = createUserSchema.validate(
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

  // If no errors, hash the password
  const saltRounds = appConfig.bcryptSalt; // Adjust as needed (higher = slower but more secure)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    // Update req.body with the hashed password
    req.body.password = hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }

  // If no errors, continue to next handler
  next();
};

export const validateUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate user data
  const result: ValidationResult = updateUserSchema.validate(
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

  // If no errors, hash the password if provided
  if (req.body.password) {
    const saltRounds = appConfig.bcryptSalt; // Adjust as needed (higher = slower but more secure)
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      // Update req.body with the hashed password
      req.body.password = hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      return res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }

  // If no errors, continue to next handler
  next();
};

export const validateQueryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = queryUsersSchema.validate(
    req.query,
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
