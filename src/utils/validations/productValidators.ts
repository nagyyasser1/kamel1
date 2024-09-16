import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
});

const validateCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createProductSchema.validate(req.body, {
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

export default {
  validateCreateProduct,
};
