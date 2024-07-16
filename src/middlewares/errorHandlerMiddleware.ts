import { STATUS_CODES } from "../constants/statusCodes";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
};

export default errorHandler;
