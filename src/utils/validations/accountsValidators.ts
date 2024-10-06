import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createAccountSchema = Joi.object({
  name: Joi.string().trim().required(),
  number: Joi.string().required(),
  email: Joi.string().trim().optional(),
  description: Joi.string().required(),
  categoryId: Joi.string().required(),
});

export const updateAccountSchema = Joi.object({
  name: Joi.string().trim().optional(),
  number: Joi.number().optional(),
  email: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  categoryId: Joi.string().optional(),
});

export const validateCreateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createAccountSchema.validate(req.body, {
    abortEarly: false,
  });

  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  // Transform the `number` field from number to string
  req.body.number = req.body.number.toString();

  next();
};

export const validateUpdateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = updateAccountSchema.validate(req.body, {
    abortEarly: false,
  });

  if (result.error) {
    return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      message: "Invalid request data",
      errors: result.error.details.map((err) => err.message),
    });
  }

  next();
};
