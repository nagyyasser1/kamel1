import prisma from "../prisma";

// Create a transaction
export const createTransaction = async (data: {
  amount: number;
  number: number;
  fromId: string;
  toId: string;
  description: string;
}) => {
  return await prisma.transaction.create({
    data,
  });
};

// Update a transaction
export const updateTransaction = async (
  id: string,
  data: Partial<{
    amount: number;
    number: number;
    fromAccountId: string;
    toAccountId: string;
  }>
) => {
  return await prisma.transaction.update({
    where: { id },
    data,
  });
};

// Delete a transaction
export const deleteTransaction = async (id: string) => {
  return await prisma.transaction.delete({
    where: { id },
  });
};

export const deleteTransactions = async () => {
  return await prisma.transaction.deleteMany();
};

// Get all transactions
export const getAllTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      from: true,
      to: true,
    },
  });
};

// Get a transaction by ID
export const getTransactionById = async (id: string) => {
  return await prisma.transaction.findUnique({
    where: { id },
  });
};

export const getTransactionByNum = async (number: number) => {
  return await prisma.transaction.findUnique({
    where: { number },
  });
};

interface TransactionStats {
  accountId: string;
  sentTransactionsCount: number;
  receivedTransactionsCount: number;
  sentTransactionsSum: number;
  receivedTransactionsSum: number;
}

// export async function getTransactionStatsForAllAccounts(
//   year: number,
//   month: number
// ): Promise<TransactionStats[]> {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const sentTransactions = await prisma.transaction.groupBy({
//     by: ["fromAccountId"],
//     where: {
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   const receivedTransactions = await prisma.transaction.groupBy({
//     by: ["toAccountId"],
//     where: {
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   const transactionStatsMap: { [accountId: string]: TransactionStats } = {};

//   sentTransactions.forEach((transaction) => {
//     const accountId = transaction.fromId;
//     if (!transactionStatsMap[accountId]) {
//       transactionStatsMap[accountId] = {
//         accountId,
//         sentTransactionsCount: 0,
//         receivedTransactionsCount: 0,
//         sentTransactionsSum: 0,
//         receivedTransactionsSum: 0,
//       };
//     }
//     transactionStatsMap[accountId].sentTransactionsCount =
//       transaction._count?._all ?? 0;
//     transactionStatsMap[accountId].sentTransactionsSum =
//       transaction._sum.amount ?? 0;
//   });

//   receivedTransactions.forEach((transaction) => {
//     const accountId = transaction.toId;
//     if (!transactionStatsMap[accountId]) {
//       transactionStatsMap[accountId] = {
//         accountId,
//         sentTransactionsCount: 0,
//         receivedTransactionsCount: 0,
//         sentTransactionsSum: 0,
//         receivedTransactionsSum: 0,
//       };
//     }
//     transactionStatsMap[accountId].receivedTransactionsCount =
//       transaction._count?._all ?? 0;
//     transactionStatsMap[accountId].receivedTransactionsSum =
//       transaction._sum?.amount ?? 0;
//   });

//   return Object.values(transactionStatsMap);
// }

// export async function getTransactionStatsForMonth(
//   accountId: string,
//   year: number,
//   month: number
// ): Promise<TransactionStats> {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const sentTransactions = await prisma.transaction.aggregate({
//     where: {
//       fromAccountId: accountId,
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   const receivedTransactions = await prisma.transaction.aggregate({
//     where: {
//       toAccountId: accountId,
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   return {
//     accountId,
//     sentTransactionsCount: sentTransactions._count._all ?? 0,
//     receivedTransactionsCount: receivedTransactions._count._all ?? 0,
//     sentTransactionsSum: sentTransactions._sum.amount ?? 0,
//     receivedTransactionsSum: receivedTransactions._sum.amount ?? 0,
//   };
// }
