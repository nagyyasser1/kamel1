import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import * as clientsService from "../services/clientsService";
import * as suppliersService from "../services/suppliersService";
import * as assetsService from "../services/assetsService";
import CustomError from "../utils/CustomError";

const createAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accountExists: boolean = false;
    let ownerExists: boolean;

    const { type, ownerId } = req.body;

    switch (type) {
      case "ASSET":
        ownerExists = await assetsService.assetExists(ownerId);
        break;
      case "CLIENT":
        ownerExists = await clientsService.clientExists(ownerId);
        break;
      case "SUPPLIER":
        ownerExists = await suppliersService.supplierExists(ownerId);
        break;
      default:
        throw new CustomError("Invalid account type", STATUS_CODES.BAD_REQUEST);
    }

    if (!ownerExists) {
      throw new CustomError(
        `${type} with id: ${ownerId} doesn't exists!.`,
        STATUS_CODES.NOT_FOUND
      );
    }

    accountExists = await accountsService.accountExistsForC_S_A(type, ownerId);

    if (accountExists) {
      throw new CustomError(
        `Account aready exists for user.`,
        STATUS_CODES.CONFLICT
      );
    }

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
