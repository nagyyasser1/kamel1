import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";

const createAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountsService.createAccount(req.body);
    res.status(STATUS_CODES.CREATED).json(account);
  } catch (error) {
    next(error);
  }
};

const updateAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const account = await accountsService.updateAccount(id, req.body);
    res.status(STATUS_CODES.OK).json(account);
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

const getAccountByIdCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const account = await accountsService.getAccountById(id);
    if (account) {
      res.status(STATUS_CODES.OK).json(account);
    } else {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: "Account not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createAccountCtr,
  updateAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
  getAccountByIdCtr,
};
