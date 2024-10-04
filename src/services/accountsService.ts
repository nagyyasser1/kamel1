import getCurrentYear from "../utils/getCurrentYear";
import prisma from "../prisma";

const createAccount = async (data: any) => {
  return await prisma.account.create({
    data,
  });
};

const deleteAccount = async (id: string) => {
  return await prisma.account.delete({
    where: { id },
  });
};

const getAllAccounts = async (categoryId?: string, name?: string) => {
  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (name && name.trim() !== "") {
    where.name = {
      contains: name,
      mode: "insensitive", // Case-insensitive search
    };
  }

  return await prisma.account.findMany({
    where,
    include: {
      category: true,
    },
  });
};

const getAccountById = async (id: string) => {
  return await prisma.account.findUnique({
    where: { id },
    include: {
      category: true,
      sentTransactions: true,
      receivedTransactions: true,
    },
  });
};

const getAccountByName = async (name: string) => {
  return await prisma.account.findUnique({
    where: { name },
  });
};

const getAccountByNumber = async (number: string) => {
  return await prisma.account.findUnique({
    where: { number },
  });
};

async function getCategoryTransactionSummary(year: number) {
  const categories = await prisma.category.findMany({
    where: {
      accounts: {
        some: {},
      },
    },
    include: {
      accounts: {
        include: {
          sentTransactions: {
            where: {
              OR: [
                {
                  createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                  },
                },
                {
                  createdAt: {
                    lt: new Date(`${year}-01-01`), // Before the start of the provided year
                  },
                },
              ],
            },
          },
          receivedTransactions: {
            where: {
              OR: [
                {
                  createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`),
                  },
                },
                {
                  createdAt: {
                    lt: new Date(`${year}-01-01`), // Before the start of the provided year
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  const summary = categories.map((category) => {
    const monthlySummary = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalSentTransactions: 0,
      totalReceivedTransactions: 0,
      totalSentAmount: BigInt(0),
      totalReceivedAmount: BigInt(0),
    }));

    let totalSentTransactions = 0;
    let totalReceivedTransactions = 0;
    let totalSentAmount = BigInt(0);
    let totalReceivedAmount = BigInt(0);

    let allPreviousSentTransactions = 0;
    let allPreviousReceivedTransactions = 0;
    let allPreviousSentAmount = BigInt(0);
    let allPreviousReceivedAmount = BigInt(0);

    category.accounts.forEach((account) => {
      account.sentTransactions.forEach((transaction) => {
        const transactionYear = transaction.createdAt.getFullYear();
        const month = transaction.createdAt.getMonth();

        if (transactionYear === year) {
          monthlySummary[month].totalSentTransactions += 1;
          monthlySummary[month].totalSentAmount += BigInt(transaction.amount);

          totalSentTransactions += 1;
          totalSentAmount += BigInt(transaction.amount);
        } else if (transactionYear < year) {
          allPreviousSentTransactions += 1;
          allPreviousSentAmount += BigInt(transaction.amount);
        }
      });

      account.receivedTransactions.forEach((transaction) => {
        const transactionYear = transaction.createdAt.getFullYear();
        const month = transaction.createdAt.getMonth();

        if (transactionYear === year) {
          monthlySummary[month].totalReceivedTransactions += 1;
          monthlySummary[month].totalReceivedAmount += BigInt(
            transaction.amount
          );

          totalReceivedTransactions += 1;
          totalReceivedAmount += BigInt(transaction.amount);
        } else if (transactionYear < year) {
          allPreviousReceivedTransactions += 1;
          allPreviousReceivedAmount += BigInt(transaction.amount);
        }
      });
    });

    return {
      categoryId: category.id,
      categoryName: category.name,
      totalSentTransactions,
      totalReceivedTransactions,
      totalSentAmount: Number(totalSentAmount),
      totalReceivedAmount: Number(totalReceivedAmount),
      allPreviousSentTransactions,
      allPreviousReceivedTransactions,
      allPreviousSentAmount: Number(allPreviousSentAmount),
      allPreviousReceivedAmount: Number(allPreviousReceivedAmount),
      monthlySummary: monthlySummary.map((monthData) => ({
        ...monthData,
        totalSentAmount: Number(monthData.totalSentAmount),
        totalReceivedAmount: Number(monthData.totalReceivedAmount),
      })),
    };
  });

  return summary;
}

async function getTransactionsSummaryForArrayOfAccountsNumber(
  accountNums: any
) {
  // Define the start and end dates for this year and previous years
  const now = new Date();
  const thisYearStart = new Date(now.getFullYear(), 0, 1);

  // Query to get transactions summary for each account number
  const summaries = await Promise.all(
    accountNums.map(async (accountNum: any) => {
      const account = await prisma.account.findUnique({
        where: { number: accountNum },
        include: {
          sentTransactions: true,
          receivedTransactions: true,
        },
      });

      if (!account) {
        return null; // Handle case where account is not found
      }

      // Aggregate this year's sent transactions
      const thisYearSent = await prisma.transaction.aggregate({
        where: {
          fromId: account.id,
          createdAt: {
            gte: thisYearStart,
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Aggregate this year's received transactions
      const thisYearReceived = await prisma.transaction.aggregate({
        where: {
          toId: account.id,
          createdAt: {
            gte: thisYearStart,
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Aggregate previous years' sent transactions
      const previousYearsSent = await prisma.transaction.aggregate({
        where: {
          fromId: account.id,
          createdAt: {
            lt: thisYearStart,
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Aggregate previous years' received transactions
      const previousYearsReceived = await prisma.transaction.aggregate({
        where: {
          toId: account.id,
          createdAt: {
            lt: thisYearStart,
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      // Calculate balances
      const thisYearBalance =
        (thisYearReceived._sum.amount || 0) - (thisYearSent._sum.amount || 0);

      const previousYearsBalance =
        (previousYearsReceived._sum.amount || 0) -
        (previousYearsSent._sum.amount || 0);

      const totalBalance = thisYearBalance + previousYearsBalance;

      return {
        id: account.id,
        accountName: account.name,
        accountCode: account.number,
        totalBalance: totalBalance,
        thisYear: {
          totalSentTransactions: thisYearSent._count.id || 0,
          totalSentAmount: thisYearSent._sum.amount || 0,
          totalReceivedTransactions: thisYearReceived._count.id || 0,
          totalReceivedAmount: thisYearReceived._sum.amount || 0,
          balance: thisYearBalance,
        },
        previousYears: {
          totalSentTransactions: previousYearsSent._count.id || 0,
          totalSentAmount: previousYearsSent._sum.amount || 0,
          totalReceivedTransactions: previousYearsReceived._count.id || 0,
          totalReceivedAmount: previousYearsReceived._sum.amount || 0,
          balance: previousYearsBalance,
        },
      };
    })
  );

  return summaries.filter((summary) => summary !== null);
}

const getAccountsBalances = async () => {
  const { startOfYear, endOfYear, previousStartOfYear, previousEndOfYear } =
    getCurrentYear();

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      name: true,
      number: true,
      sentTransactions: {
        where: {
          OR: [
            {
              createdAt: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
            {
              createdAt: {
                gte: previousStartOfYear,
                lte: previousEndOfYear,
              },
            },
          ],
        },
        select: {
          amount: true,
          createdAt: true,
        },
      },
      receivedTransactions: {
        where: {
          OR: [
            {
              createdAt: {
                gte: startOfYear,
                lte: endOfYear,
              },
            },
            {
              createdAt: {
                gte: previousStartOfYear,
                lte: previousEndOfYear,
              },
            },
          ],
        },
        select: {
          amount: true,
          createdAt: true,
        },
      },
    },
  });

  // Calculate balances for current and previous years
  const accountsArray = accounts.map((account) => {
    const currentYearSent = account.sentTransactions
      .filter(
        (transaction) =>
          transaction.createdAt >= startOfYear &&
          transaction.createdAt <= endOfYear
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const previousYearsSent = account.sentTransactions
      .filter(
        (transaction) =>
          transaction.createdAt >= previousStartOfYear &&
          transaction.createdAt <= previousEndOfYear
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const currentYearReceived = account.receivedTransactions
      .filter(
        (transaction) =>
          transaction.createdAt >= startOfYear &&
          transaction.createdAt <= endOfYear
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const previousYearsReceived = account.receivedTransactions
      .filter(
        (transaction) =>
          transaction.createdAt >= previousStartOfYear &&
          transaction.createdAt <= previousEndOfYear
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const currentYearBalance = currentYearReceived - currentYearSent;
    const previousYearsBalance = previousYearsReceived - previousYearsSent;

    const totalBalance = currentYearBalance + previousYearsBalance;

    return {
      id: account.id,
      name: account.name,
      number: account.number,
      balance: totalBalance || 0,
      currentYear: {
        balance: currentYearBalance || 0,
        currentYearReceived: currentYearReceived || 0,
        currentYearSent: currentYearSent || 0,
      },
      previousYears: {
        balance: previousYearsBalance || 0,
        previousYearsReceived: previousYearsReceived || 0,
        previousYearsSent: previousYearsSent || 0,
      },
    };
  });

  const accountsObject = accountsArray.reduce((acc, account) => {
    if (account) {
      acc[account?.number] = account;
    }
    return acc;
  }, {} as Record<string, any>);

  return { accountsObject };
};

const getAccountBalance = async (accountNumber: any) => {
  const { currentYear, startOfYear } = getCurrentYear();

  // Fetch the account by its number
  const account = await prisma.account.findUnique({
    where: { number: accountNumber },
    select: {
      id: true,
      name: true,
      sentTransactions: {
        select: {
          amount: true,
          createdAt: true,
        },
      },
      receivedTransactions: {
        select: {
          amount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!account) {
    console.log(`Account with number ${accountNumber} not found`);
    return {
      id: "",
      name: "",
      balance: 0,
      currentYear: {
        balance: 0,
        thisYearReceived: 0,
        thisYearSent: 0,
      },
      previousYears: {
        balance: 0,
        previousYearsReceived: 0,
        previousYearsSent: 0,
      },
    };
  }

  let thisYearSent = 0;
  let thisYearReceived = 0;
  let previousYearsSent = 0;
  let previousYearsReceived = 0;

  // Calculate sent and received transactions for the current year and previous years
  account?.sentTransactions.forEach((transaction) => {
    if (transaction.createdAt >= startOfYear) {
      thisYearSent += transaction.amount;
    } else {
      previousYearsSent += transaction.amount;
    }
  });

  account?.receivedTransactions.forEach((transaction) => {
    if (transaction.createdAt >= startOfYear) {
      thisYearReceived += transaction.amount;
    } else {
      previousYearsReceived += transaction.amount;
    }
  });

  // Calculate balances
  const thisYearBalance = thisYearReceived - thisYearSent;
  const previousYearsBalance = previousYearsReceived - previousYearsSent;
  const totalBalance = thisYearBalance + previousYearsBalance;

  return {
    id: account.id || "",
    name: account.name || "",
    balance: totalBalance || 0,
    currentYear: {
      balance: thisYearBalance || 0,
      thisYearReceived: thisYearReceived || 0,
      thisYearSent: thisYearSent || 0,
    },
    previousYears: {
      balance: previousYearsBalance || 0,
      previousYearsReceived: previousYearsReceived || 0,
      previousYearsSent: previousYearsSent || 0,
    },
  };
};

const getAllAccountsNums = async () => {
  const accounts = await prisma.account.findMany({
    select: {
      name: true,
      number: true,
    },
  });

  return accounts;
};

export default {
  getAccountBalance,
  getAccountsBalances,
  getAllAccounts,
  getCategoryTransactionSummary,
  getAllAccountsNums,
  getTransactionsSummaryForArrayOfAccountsNumber,
  getAccountById,
  createAccount,
  deleteAccount,
  getAccountByName,
  getAccountByNumber,
};
