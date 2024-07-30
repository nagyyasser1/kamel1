import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";

const createAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountType = req.body?.type;
    if (accountType === "CLIENT" || "SUPPLIER") {
      const existingAccount = await accountsService.getAccountByEmail(
        req.body?.email
      );

      if (existingAccount) {
        throw new CustomError(
          `Account with email ${existingAccount.email} aready exists!.`,
          STATUS_CODES.CONFLICT
        );
      }
    }
    const account = await accountsService.createAccount(req.body);
    res.status(STATUS_CODES.CREATED).json(account);
  } catch (error) {
    next(error);
  }
};

// const updateAccountCtr = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const account = await accountsService.(id, req.body);
//     res.status(STATUS_CODES.OK).json(account);
//   } catch (error) {
//     next(error);
//   }
// };

const deleteAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await accountsService.deleteAccount(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllAccountsCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accounts = await accountsService.getAllAccounts();
    res.status(STATUS_CODES.OK).json(accounts);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
};
