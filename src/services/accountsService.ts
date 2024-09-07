import ACCOUNTS_CODES_FOR_INCOME, {
  FP_accounts,
} from "../constants/accountsCodes";
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

export const getAllAccounts = async (categoryId?: string, name?: string) => {
  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (name) {
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

export async function getCategoryTransactionSummary(year: number) {
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

export async function getTransactionsSummaryForArrayOfAccountsNumber(
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

export async function statementFPositionSrvc() {
  const accountNums = FP_accounts;

  // Define the start and end dates for this year and previous years
  const now = new Date();
  const thisYearStart = new Date(now.getFullYear(), 0, 1);

  // Query to get transactions summary for each account number
  const summaries = await Promise.all(
    accountNums.map(async (accountNum) => {
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
        previousYearsReceived._sum.amount ||
        0 - (previousYearsSent._sum.amount || 0);

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
