import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

const createProductTransSchema = Joi.object({
  income: Joi.number().required(),
  outcome: Joi.number().required(),
  productId: Joi.string().required(),
  createdAt: Joi.date().optional(),
});

const validateCreateProductTrans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createProductTransSchema.validate(req.body, {
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
  validateCreateProductTrans,
};
