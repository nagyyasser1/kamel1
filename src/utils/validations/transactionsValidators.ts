import { Request, Response, NextFunction } from "express";
import Joi, { ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createTransactionSchema = Joi.object({
  fromId: Joi.string().required(),
  toId: Joi.string().required(),
  amount: Joi.number().required(),
  number: Joi.number().required(),
  description: Joi.string().required(),
  date: Joi.date().optional(),
});

export const updateTransactionSchema = Joi.object({
  fromAccountId: Joi.string().optional(),
  toAccountId: Joi.string().optional(),
  amount: Joi.number().optional(),
  number: Joi.number().optional(),
  description: Joi.string().optional(),
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
