import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";
import entryExists from "../utils/entryExists.util";
import { EntryType } from "../utils/enums";

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

    const existingAccount = await accountsService.getAccountByName(
      req.body?.name
    );

    if (existingAccount) {
      throw new CustomError(
        `Account with name ${existingAccount.name} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
    }

    const existingAccountByNumber = await accountsService.getAccountByNumber(
      req.body?.number
    );

    if (existingAccountByNumber) {
      throw new CustomError(
        `Account with number ${existingAccountByNumber.number} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
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
    const { categroyId, name } = req.query;
    const accounts = await accountsService.getAllAccounts(
      categroyId as string,
      name as string
    );
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

export const getTransactionsSummaryForCategories = async (
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
    res.status(STATUS_CODES.OK).send(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
  getAccountById,
  getTransactionsSummaryForCategories,
};
