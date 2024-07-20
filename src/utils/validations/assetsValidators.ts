import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createAssetSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  code: Joi.number().required(),
});

export const updateAssetSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  code: Joi.number().optional(),
});

export const queryAssetsSchema = Joi.object({
  code: Joi.number().optional(),
});

export const validateCreateAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createAssetSchema.validate(req.body, {
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

export const validateUpdateAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = updateAssetSchema.validate(req.body, {
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

export const validateQueryAssets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = queryAssetsSchema.validate(req.query, {
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
