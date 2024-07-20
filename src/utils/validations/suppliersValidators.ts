import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  type: Joi.string().required(),
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  type: Joi.string().optional(),
});

export const querySuppliersSchema = Joi.object({
  email: Joi.string().email().optional(),
});

export const validateCreateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createSupplierSchema.validate(req.body, {
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

export const validateUpdateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = updateSupplierSchema.validate(req.body, {
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

export const validateQuerySuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = querySuppliersSchema.validate(req.query, {
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
