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

  // Define start and end of the current year
  const thisYearStart = new Date(today.getFullYear(), 0, 1, 0, 0, 0);

  // Define end of yesterday
  const yesterdayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
    23,
    59,
    59
  );

  // Query for transactions of today
  const todayTransactions = await prisma.productTransaction.findMany({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    select: {
      accountId: true,
      income: true,
      outcome: true,
      account: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
    },
  });

  // Query for transactions of this year until yesterday
  const yearToYesterdayTransactions = await prisma.productTransaction.findMany({
    where: {
      createdAt: {
        gte: thisYearStart,
        lte: yesterdayEnd,
      },
    },
    select: {
      accountId: true,
      income: true,
      outcome: true,
    },
  });

  // Query for all transactions this year (including today)
  const allYearTransactions = await prisma.productTransaction.findMany({
    where: {
      createdAt: {
        gte: thisYearStart,
      },
    },
    select: {
      accountId: true,
      income: true,
      outcome: true,
    },
  });

  // Query for last year's transactions
  const lastYearTransactions = await prisma.productTransaction.findMany({
    where: {
      createdAt: {
        lt: thisYearStart, // Before this year
      },
    },
    select: {
      accountId: true,
      income: true,
      outcome: true,
    },
  });

  // Helper function to calculate totals for income and outcome
  const calculateTotals = (transactions: any) => {
    return transactions.reduce(
      (totals: any, txn: any) => {
        totals.income += txn.income || 0;
        totals.outcome += txn.outcome || 0;
        return totals;
      },
      { income: 0, outcome: 0 }
    );
  };

  // Group the results by accountId
  const groupedResults = todayTransactions.map((todayProduct) => {
    const { accountId, account } = todayProduct;

    // Calculate totals for today
    const todayTotals = calculateTotals(
      todayTransactions.filter((txn) => txn.accountId === accountId)
    );

    // Calculate totals for this year until yesterday
    const yearToYesterdayTotals = calculateTotals(
      yearToYesterdayTransactions.filter((txn) => txn.accountId === accountId)
    );

    // Calculate totals for all this year's transactions (including today)
    const allYearTotals = calculateTotals(
      allYearTransactions.filter((txn) => txn.accountId === accountId)
    );

    // Calculate totals for last year's transactions
    const lastYearTotals = calculateTotals(
      lastYearTransactions.filter((txn) => txn.accountId === accountId)
    );

    return {
      id: account.id,
      name: account.name,
      number: account.number,
      current: {
        income: todayTotals.income, // Today's income
        outcome: todayTotals.outcome, // Today's outcome
        firstBalance: Math.abs(
          yearToYesterdayTotals.income - yearToYesterdayTotals.outcome
        ), // Balance until yesterday
        lastBalance:
          Math.abs(
            yearToYesterdayTotals.income - yearToYesterdayTotals.outcome
          ) + Math.abs(todayTotals.income - todayTotals.outcome), // Balance + today's transactions
      },
      all: {
        income: allYearTotals.income, // Total income for the year
        outcome: allYearTotals.outcome, // Total outcome for the year
        firstBalance: Math.abs(lastYearTotals.income - lastYearTotals.outcome), // Last year's balance
        lastBalance:
          Math.abs(lastYearTotals.income - lastYearTotals.outcome) +
          Math.abs(allYearTotals.income - allYearTotals.outcome), // Last year's balance + this year's
      },
    };
  });

  return groupedResults;
}

export default {
  createTransaction,
  getAllTransactions,
  getTransactionsByProductId,
  updateTransaction,
  deleteTransaction,
  getProductBalance,
};
