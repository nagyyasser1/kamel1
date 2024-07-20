import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

enum AccountType {
  CLIENT = "CLIENT",
  SUPPLIER = "SUPPLIER",
  ASSET = "ASSET",
}

export const createAccountSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(AccountType))
    .required(),
  ownerId: Joi.string().required(),
});

export const updateAccountSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(AccountType))
    .optional(),
});

export const queryAccountsSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(AccountType))
    .optional(),
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

export const validateQueryAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = queryAccountsSchema.validate(req.query, {
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
