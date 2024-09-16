import prisma from "../prisma";

// Types
export interface TransactionInput {
  productId: string;
  income: number;
  outcome: number;
}

// Create Product Transaction
const createTransaction = async (data: TransactionInput) => {
  return prisma.productTransaction.create({
    data,
  });
};

// Get All Transactions
const getAllTransactions = async () => {
  return prisma.productTransaction.findMany({
    include: {
      product: true,
    },
  });
};

// Get Transactions By Product ID
const getTransactionsByProductId = async (productId: string) => {
  return prisma.productTransaction.findMany({
    where: { productId },
    include: {
      product: true,
    },
  });
};

// Update Transaction
const updateTransaction = async (
  id: string,
  income?: number,
  outcome?: number
) => {
  return prisma.productTransaction.update({
    where: { id },
    data: {
      income,
      outcome,
    },
  });
};

// Delete Transaction
const deleteTransaction = async (id: string) => {
  return prisma.productTransaction.delete({
    where: { id },
  });
};

export default {
  createTransaction,
  getAllTransactions,
  getTransactionsByProductId,
  updateTransaction,
  deleteTransaction,
};
