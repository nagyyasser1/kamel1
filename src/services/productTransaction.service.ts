import ProductTransactionModel from "../models/productTransaction.model";
import { TransactionInput } from "../models/productTransaction.model";

// Service to create a transaction
const createTransaction = async (data: TransactionInput) => {
  return await ProductTransactionModel.createTransaction(data);
};

// Service to get all transactions
const getAllTransactions = async () => {
  return await ProductTransactionModel.getAllTransactions();
};

// Service to get transactions by product ID
const getTransactionsByProductId = async (productId: string) => {
  return await ProductTransactionModel.getTransactionsByProductId(productId);
};

// Service to update a transaction
const updateTransaction = async (
  id: string,
  income?: number,
  outcome?: number
) => {
  return await ProductTransactionModel.updateTransaction(id, income, outcome);
};

// Service to delete a transaction
const deleteTransaction = async (id: string) => {
  return await ProductTransactionModel.deleteTransaction(id);
};

export default {
  createTransaction,
  getAllTransactions,
  getTransactionsByProductId,
  updateTransaction,
  deleteTransaction,
};
