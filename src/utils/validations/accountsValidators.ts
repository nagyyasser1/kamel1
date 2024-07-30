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
    .trim()
    .valid(...Object.values(AccountType))
    .required(),
  code: Joi.number().required(),
  name: Joi.string().when("type", {
    is: Joi.valid(AccountType.ASSET),
    then: Joi.string().trim().required(),
    otherwise: Joi.string().required(),
  }),
  email: Joi.string().when("type", {
    is: Joi.valid(AccountType.CLIENT, AccountType.SUPPLIER),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  description: Joi.string().required(),
  status: Joi.string()
    .when("type", {
      is: Joi.valid(AccountType.CLIENT, AccountType.SUPPLIER),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .default(null),
});

export const updateAccountSchema = Joi.object({
  type: Joi.string()
    .trim()
    .valid(...Object.values(AccountType))
    .optional(),
  code: Joi.number().optional(),
  name: Joi.string().when("type", {
    is: Joi.valid(AccountType.ASSET),
    then: Joi.string().trim().optional(),
    otherwise: Joi.string().optional(),
  }),
  email: Joi.string().when("type", {
    is: Joi.valid(AccountType.CLIENT, AccountType.SUPPLIER),
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  description: Joi.string().optional(),
  status: Joi.string().when("type", {
    is: Joi.valid(AccountType.CLIENT, AccountType.SUPPLIER),
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
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
