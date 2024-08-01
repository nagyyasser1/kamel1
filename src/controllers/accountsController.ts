import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";
import entryExists from "../utils/entryExists.util";
import { EntryType } from "../utils/enums";
import getMonthRange from "../utils/getMonthRange.util";

const createAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categroyExists = await entryExists(
      EntryType.category,
      req.body?.categoryId
    );

    if (!categroyExists) {
      throw new CustomError(
        `category with id:${req.body?.categoryId} not found!.`,
        STATUS_CODES.NOT_FOUND
      );
    }
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
    } else {
      const existingAccount = await accountsService.getAccountByName(
        req.body?.name
      );
      if (existingAccount) {
        throw new CustomError(
          `Account with email ${existingAccount.name} aready exists!.`,
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

const getAccountById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountsService.getAccountById(req.params?.id);
    if (!account) {
      throw new CustomError(
        `account with id:${req.params?.id} not found`,
        STATUS_CODES.NOT_FOUND
      );
    }

    res.status(STATUS_CODES.OK).send(account);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, month } = req.query;
    const { start, end } = getMonthRange(Number(year), Number(month));
    const result = await accountsService.getTransactionsSummary(start, end);
    res.status(STATUS_CODES.OK).send(result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummaryForAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, month } = req.query;
    const { id } = req.params;
    const { start, end } = getMonthRange(Number(year), Number(month));
    const summary = await accountsService.getTransactionsSummaryForAccount(
      id,
      start,
      end
    );

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummaryForCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year, month } = req.query;
    const { id } = req.params;
    const { start, end } = getMonthRange(Number(year), Number(month));
    const result = await accountsService.getTransactionsSummaryForCategory(
      id,
      start,
      end
    );
    res.status(STATUS_CODES.OK).send(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
  getTransactionsSummary,
  getAccountById,
  getTransactionsSummaryForAccount,
  getTransactionsSummaryForCategory,
};
