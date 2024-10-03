import accountsService from "../../services/accountsService";
import { STATUS_CODES } from "../../constants/statusCodes";
import CustomError from "../../utils/CustomError";
import { NextFunction, Request, Response } from "express";

export const mizanAlmarajieihController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.query;

    if (!year) {
      throw new CustomError(
        "year query must be provided!",
        STATUS_CODES.BAD_REQUEST
      );
    }

    const result = await accountsService.getCategoryTransactionSummary(
      Number(year)
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export default mizanAlmarajieihController;
