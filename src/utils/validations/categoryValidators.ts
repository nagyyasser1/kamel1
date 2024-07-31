import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
  status: Joi.boolean().required(),
  parentId: Joi.number().allow(null).required(),
});

export const validateCreateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createCategorySchema.validate(req.body, {
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
