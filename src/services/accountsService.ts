import prisma from "../prisma";

export const createAccount = async (data: any) => {
  return await prisma.account.create({
    data,
  });
};

export const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  });
};

export const getAllAccounts = async (categoryId?: string) => {
  return await prisma.account.findMany({
    where: categoryId ? { categoryId: categoryId } : {},
    include: {
      category: true,
    },
  });
};

export const getAccountById = async (id: string) => {
  return await prisma.account.findUnique({
    where: { id },
    include: {
      category: true,
      sentTransactions: true,
      receivedTransactions: true,
    },
  });
};

export const getAccountByName = async (name: string) => {
  return await prisma.account.findUnique({
    where: { name },
  });
};

export const getAccountByNumber = async (number: number) => {
  return await prisma.account.findUnique({
    where: { number },
  });
};

export const getTransactionsSummary = async (start: any, end: any) => {
  // Step 1: Fetch accounts grouped by category
  const accounts = await prisma.account.findMany({
    where: {
      OR: [
        {
          sentTransactions: {
            some: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
        {
          receivedTransactions: {
            some: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      ],
    },
    include: {
      category: true,
    },
  });

  // Step 2: Aggregate sent transactions
  const sentTransactions = await prisma.transaction.groupBy({
    by: ["fromAccountId"],
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
  });

  // Step 3: Aggregate received transactions
  const receivedTransactions = await prisma.transaction.groupBy({
    by: ["toAccountId"],
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
  });

  // Step 4: Combine results
  const summary = accounts.map((account) => {
    const sent = sentTransactions.find((tx) => tx.fromAccountId === account.id);
    const received = receivedTransactions.find(
      (tx) => tx.toAccountId === account.id
    );

    return {
      accountId: account.id,
      accountName: account.name,
      categoryName: account.category?.name,
      sentTransactionsCount: sent?._count?._all || 0,
      sentTransactionsSum: sent?._sum?.amount || 0,
      receivedTransactionsCount: received?._count?._all || 0,
      receivedTransactionsSum: received?._sum?.amount || 0,
    };
  });

  return summary;
};

export const getTransactionsSummaryForAccount = async (
  accountId: string,
  start: Date,
  end: Date
) => {
  const sentTransactions = await prisma.transaction.aggregate({
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
    where: {
      fromAccountId: accountId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const receivedTransactions = await prisma.transaction.aggregate({
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
    where: {
      toAccountId: accountId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      category: true,
    },
  });

  return {
    account,
    sentTransactions: {
      count: sentTransactions._count._all,
      sum: sentTransactions._sum.amount,
    },
    receivedTransactions: {
      count: receivedTransactions._count._all,
      sum: receivedTransactions._sum.amount,
    },
  };
};

// export const getTransactionsSummaryForCategory = async (
//   categoryId: string,
//   start: Date,
//   end: Date
// ) => {
//   // Fetch accounts for the specified category
//   const accounts = await prisma.account.findMany({
//     where: {
//       categoryId: categoryId,
//     },
//     select: {
//       id: true,
//     },
//   });

//   const accountIds = accounts.map((account) => account.id);

//   if (accountIds.length === 0) {
//     return {
//       sentTransactions: {
//         count: 0,
//         amount: 0,
//       },
//       receivedTransactions: {
//         count: 0,
//         amount: 0,
//       },
//     };
//   }

//   // Aggregate sent transactions
//   const sentTransactionsSummary = await prisma.transaction.aggregate({
//     where: {
//       fromAccountId: {
//         in: accountIds,
//       },
//       createdAt: {
//         gte: start,
//         lt: end,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   // Aggregate received transactions
//   const receivedTransactionsSummary = await prisma.transaction.aggregate({
//     where: {
//       toAccountId: {
//         in: accountIds,
//       },
//       createdAt: {
//         gte: start,
//         lt: end,
//       },
//     },
//     _count: {
//       _all: true,
//     },
//     _sum: {
//       amount: true,
//     },
//   });

// return {
//   sentTransactions: {
//     count: sentTransactionsSummary._count._all || 0,
//     amount: sentTransactionsSummary._sum.amount || 0,
//   },
//   receivedTransactions: {
//     count: receivedTransactionsSummary._count._all || 0,
//     amount: receivedTransactionsSummary._sum.amount || 0,
//   },
// };
// };

export const getTransactionsSummaryForCategory = async (
  categoryId: string,
  start: Date,
  end: Date
) => {
  // Aggregate sent transactions within the specified month and year
  const sentTransactionsSummary = await prisma.transaction.groupBy({
    by: ["fromAccountId"],
    where: {
      fromAccount: {
        categoryId: categoryId,
      },
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
  });

  // Aggregate received transactions within the specified month and year
  const receivedTransactionsSummary = await prisma.transaction.groupBy({
    by: ["toAccountId"],
    where: {
      toAccount: {
        categoryId: categoryId,
      },
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    _count: {
      _all: true,
    },
    _sum: {
      amount: true,
    },
  });

  // Summarize results
  const totalSentTransactions = sentTransactionsSummary.reduce(
    (acc, group) => acc + group._count._all,
    0
  );
  const totalReceivedTransactions = receivedTransactionsSummary.reduce(
    (acc, group) => acc + group._count._all,
    0
  );

  const sumSentAmount = sentTransactionsSummary.reduce(
    (acc, group) => acc + (group._sum.amount ?? 0),
    0
  );
  const sumReceivedAmount = receivedTransactionsSummary.reduce(
    (acc, group) => acc + (group._sum.amount ?? 0),
    0
  );

  // return {
  //   totalSentTransactions,
  //   totalReceivedTransactions,
  //   sumSentAmount,
  //   sumReceivedAmount,
  // };

  return {
    sentTransactions: {
      count: totalSentTransactions,
      amount: sumSentAmount,
    },
    receivedTransactions: {
      count: totalReceivedTransactions,
      amount: sumReceivedAmount,
    },
  };
};
