import { NextFunction, Request, Response } from "express";
import ProductTransactionService from "../services/productTransaction.service";

// Controller to create a transaction
const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await ProductTransactionService.createTransaction(
      req.body
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

// Controller to get all transactions
const getAllTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await ProductTransactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Controller to get transactions by product ID
const getTransactionsByProductId = async (req: Request, res: Response) => {
  try {
    const transactions =
      await ProductTransactionService.getTransactionsByProductId(
        req.params.productId
      );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Controller to update a transaction
const updateTransaction = async (req: Request, res: Response) => {
  try {
    const updatedTransaction =
      await ProductTransactionService.updateTransaction(
        req.params.id,
        req.body.income,
        req.body.outcome
      );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

// Controller to delete a transaction
const deleteTransaction = async (req: Request, res: Response) => {
  try {
    await ProductTransactionService.deleteTransaction(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await ProductTransactionService.getProductBalance();
    res.send(stats);
  } catch (error) {
    next(error);
  }
};

export default {
  createTransaction,
  getAllTransactions,
  getTransactionsByProductId,
  updateTransaction,
  deleteTransaction,
  getStats,
};
