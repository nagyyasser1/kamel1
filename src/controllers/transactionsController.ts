import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as transactionsService from "../services/transactionsService";
import prisma from "../prisma";

const createTransactionCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate that fromAccountId and toAccountId exist in the Account table
    const fromAccount = await prisma.account.findUnique({
      where: { id: req.body.fromId },
    });

    const toAccount = await prisma.account.findUnique({
      where: { id: req.body.toId },
    });

    if (!fromAccount) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `Account with id ${req.body.fromId} does not exist`,
      });
    }

    if (!toAccount) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: `Account with id ${req.body.toId} does not exist`,
      });
    }
    const transaction = await transactionsService.createTransaction(req.body);
    res.status(STATUS_CODES.CREATED).json(transaction);
  } catch (error) {
    next(error);
  }
};

const updateTransactionCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const transaction = await transactionsService.updateTransaction(
      id,
      req.body
    );
    res.status(STATUS_CODES.OK).json(transaction);
  } catch (error) {
    next(error);
  }
};

const deleteTransactionCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await transactionsService.deleteTransaction(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllTransactionsCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await transactionsService.getAllTransactions();
    res.status(STATUS_CODES.OK).json(transactions);
  } catch (error) {
    next(error);
  }
};

const getTransactionByIdCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const transaction = await transactionsService.getTransactionById(id);
    if (transaction) {
      res.status(STATUS_CODES.OK).json(transaction);
    } else {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Transaction not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createTransactionCtr,
  updateTransactionCtr,
  deleteTransactionCtr,
  getAllTransactionsCtr,
  getTransactionByIdCtr,
};
