import { Request, Response, NextFunction } from "express";
import Joi, { ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createTransactionSchema = Joi.object({
  fromAccountId: Joi.string().required(),
  toAccountId: Joi.string().required(),
  amount: Joi.number().required(),
  description: Joi.string().required(),
});

export const updateTransactionSchema = Joi.object({
  fromAccountId: Joi.string(),
  toAccountId: Joi.string(),
  amount: Joi.number(),
  description: Joi.string(),
});

export const validateCreateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createTransactionSchema.validate(req.body, {
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

export const validateUpdateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = updateTransactionSchema.validate(req.body, {
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
