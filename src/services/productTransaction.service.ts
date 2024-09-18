import ProductTransactionModel from "../models/productTransaction.model";
import { TransactionInput } from "../models/productTransaction.model";
import prisma from "../prisma";

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

async function getProductBalance() {
  const today = new Date();

  // Define start and end of the current day
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  // Define start and end of last year
  const lastYearStart = new Date(today.getFullYear() - 1, 0, 1, 0, 0, 0); // January 1st of last year
  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59); // December 31st of last year

  // Define start and end of the current year
  const thisYearStart = new Date(today.getFullYear(), 0, 1, 0, 0, 0); // January 1st, 00:00:00 of the current year
  const thisYearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59); // December 31st, 23:59:59 of the current year

  // Query for current day transactions
  const currentDayTransactions = await prisma.account.findMany({
    where: {
      ProductTransaction: {
        some: {},
      },
    },
    include: {
      ProductTransaction: {
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          income: true,
          outcome: true,
        },
      },
    },
  });

  // Query for all day transactions
  const allDayTransactions = await prisma.account.findMany({
    where: {
      ProductTransaction: {
        some: {
          createdAt: {
            gte: thisYearStart,
            lte: thisYearEnd,
          },
        },
      },
    },
    include: {
      ProductTransaction: {
        select: {
          income: true,
          outcome: true,
        },
      },
    },
  });

  // Query for transactions of last year
  const lastYearTransactions = await prisma.account.findMany({
    where: {
      ProductTransaction: {
        some: {
          createdAt: {
            gte: lastYearStart,
            lte: lastYearEnd,
          },
        },
      },
    },
    include: {
      ProductTransaction: {
        select: {
          income: true,
          outcome: true,
        },
      },
    },
  });

  // Format the result
  const result = currentDayTransactions.map((product) => {
    const currentIncome = product.ProductTransaction.reduce(
      (sum, txn) => sum + txn.income,
      0
    );
    const currentOutcome = product.ProductTransaction.reduce(
      (sum, txn) => sum + txn.outcome,
      0
    );

    const allProduct = allDayTransactions.find((p) => p.id === product.id);
    const allIncome =
      allProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.income,
        0
      ) || 0;
    const allOutcome =
      allProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.outcome,
        0
      ) || 0;

    const lastYearProduct = lastYearTransactions.find(
      (p) => p.id === product.id
    );
    const lastYearIncome =
      lastYearProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.income,
        0
      ) || 0;
    const lastYearOutcome =
      lastYearProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.outcome,
        0
      ) || 0;

    return {
      id: product.id,
      name: product.name,
      number: product.number,
      current: {
        income: currentIncome,
        outcome: currentOutcome,
        firstBalance: Math.abs(allIncome - allOutcome),
        lastBalance:
          Math.abs(allIncome - allOutcome) +
          Math.abs(currentIncome - currentOutcome),
      },
      all: {
        income: allIncome,
        outcome: allOutcome,
        firstBalance: Math.abs(lastYearIncome - lastYearOutcome),
        lastBalance:
          Math.abs(allIncome - allOutcome) +
          Math.abs(currentIncome - currentOutcome),
      },
    };
  });

  return result;
}

export default {
  createTransaction,
  getAllTransactions,
  getTransactionsByProductId,
  updateTransaction,
  deleteTransaction,
  getProductBalance,
};
