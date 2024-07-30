import { CreateAccountData, UpdateAccountData } from "../interfaces/dtos";
import prisma from "../prisma";

export const createAccount = async (data: any) => {
  return await prisma.account.create({
    data,
  });
};

// export const updateAccount = async (id: string, data: UpdateAccountData) => {
//   let accountData: any = {};

//   if (data.type) {
//     accountData.type = data.type;
//   }

//   if (data.ownerId) {
//     switch (data.type) {
//       case "ASSET":
//         accountData.asset = { connect: { id: data.ownerId } };
//         break;
//       case "CLIENT":
//         accountData.client = { connect: { id: data.ownerId } };
//         break;
//       case "SUPPLIER":
//         accountData.supplier = { connect: { id: data.ownerId } };
//         break;
//       default:
//         throw new Error("Invalid account type");
//     }
//   }

//   return await prisma.account.update({
//     where: { id },
//     data: accountData,
//   });
// };

export const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  });
};

export const getAllAccounts = async () => {
  return await prisma.account.findMany({});
};

export const getAccountById = async (id: string) => {
  return await prisma.account.findUnique({
    where: { id },
  });
};

export const getAccountByEmail = async (email: string) => {
  return await prisma.account.findUnique({
    where: { email },
  });
};

// export async function getTransactionStatsForAllAccounts(
//   year: number,
//   month: number
// ): Promise<TransactionStats[]> {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const accounts = await prisma.account.findMany({
//     where: {
//       OR: [{ type: "ASSET" }, { type: "CLIENT" }, { type: "SUPPLIER" }],
//     },
//   });

//   const transactionStats = await Promise.all(
//     accounts.map(async (account) => {
//       const sentTransactions = await prisma.transaction.aggregate({
//         where: {
//           fromAccountId: account.id,
//           createdAt: {
//             gte: startDate,
//             lte: endDate,
//           },
//         },
//         _count: {
//           _all: true,
//         },
//         _sum: {
//           amount: true,
//         },
//       });

//       const receivedTransactions = await prisma.transaction.aggregate({
//         where: {
//           toAccountId: account.id,
//           createdAt: {
//             gte: startDate,
//             lte: endDate,
//           },
//         },
//         _count: {
//           _all: true,
//         },
//         _sum: {
//           amount: true,
//         },
//       });

//       return {
//         accountId: account.id,
//         accountType: account.type,
//         sentTransactionsCount: sentTransactions._count._all ?? 0,
//         receivedTransactionsCount: receivedTransactions._count._all ?? 0,
//         sentTransactionsSum: sentTransactions._sum.amount ?? 0,
//         receivedTransactionsSum: receivedTransactions._sum.amount ?? 0,
//       };
//     })
//   );

//   return transactionStats;
// }

// export async function getTransactionStatsForAccountType(
//   type: AccountType,
//   year: number,
//   month: number
// ) {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const senderStats = await prisma.transaction.groupBy({
//     by: ["fromAccountId"],
//     _sum: {
//       amount: true,
//     },
//     where: {
//       fromAccount: {
//         type: type,
//       },
// createdAt: {
//   gte: startDate,
//   lte: endDate,
// },
//     },
//   });

//   const receiverStats = await prisma.transaction.groupBy({
//     by: ["toAccountId"],
//     _sum: {
//       amount: true,
//     },
//     where: {
//       toAccount: {
//         type: type,
//       },
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   });

//   const senderCount = senderStats.length;
//   const receiverCount = receiverStats.length;
//   const totalSentAmount = senderStats.reduce(
//     (sum, stat) => sum + (stat._sum.amount || 0),
//     0
//   );
//   const totalReceivedAmount = receiverStats.reduce(
//     (sum, stat) => sum + (stat._sum.amount || 0),
//     0
//   );

//   return {
//     senderCount,
//     receiverCount,
//     totalSentAmount,
//     totalReceivedAmount,
//   };
// }

// export async function getTransactionStatsForAccountType(
//   type: AccountType,
//   year: number,
//   month: number
// ) {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const sentTransactions = await prisma.transaction.aggregate({
//     _sum: {
//       amount: true,
//     },
//     _count: {
//       _all: true,
//     },
//     where: {
//       fromAccount: {
//         type: type,
//       },
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   });

//   // Aggregate received transactions for suppliers
//   const receivedTransactions = await prisma.transaction.aggregate({
//     _sum: {
//       amount: true,
//     },
//     _count: {
//       _all: true,
//     },
//     where: {
//       toAccount: {
//         type: type,
//       },
//       createdAt: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   });

//   return {
//     sentTransactionsCount: sentTransactions._count._all ?? 0,
//     sentTransactionsAmount: sentTransactions._sum.amount ?? 0,
//     receivedTransactionsCount: receivedTransactions._count._all ?? 0,
//     receivedTransactionsAmount: receivedTransactions._sum.amount ?? 0,
//   };
// }

// export async function getTransactionStatsForAccountId(
//   id: string,
//   year: number,
//   month: number
// ) {
//   const startDate = new Date(year, month - 1, 1);
//   const endDate = new Date(year, month, 0);

//   const account = await prisma.account.findUnique({
//     where: {
//       id: id,
//     },
//     include: {
//       asset: true,
//       client: true,
//       supplier: true,
//     },
//   });

//   const sentTransactions = await prisma.transaction.aggregate({
//     where: {
//       fromAccountId: id,
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
//       toAccountId: id,
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
//     accountType: account?.type,
//     owner: account?.asset,
//     sentTransactionsCount: sentTransactions._count._all ?? 0,
//     receivedTransactionsCount: receivedTransactions._count._all ?? 0,
//     sentTransactionsSum: sentTransactions._sum.amount ?? 0,
//     receivedTransactionsSum: receivedTransactions._sum.amount ?? 0,
//   };
// }
