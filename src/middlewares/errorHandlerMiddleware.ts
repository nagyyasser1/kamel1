import { STATUS_CODES } from "../constants/statusCodes";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode =
    (err instanceof CustomError && err.statusCode) ||
    STATUS_CODES.INTERNAL_SERVER_ERROR;

  res
    .status(statusCode)
    .json({ message: err?.message || "Internal server error !" });
};

export default errorHandler;
