import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import { STATUS_CODES } from "../../constants/statusCodes";

const createReportSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
});

const validateCreateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result: ValidationResult = createReportSchema.validate(req.body, {
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
  validateCreateReport,
};
