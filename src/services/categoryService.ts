import prisma from "../prisma";

// Create a category
const createCategory = async (data: {
  name: string;
  number: number;
  parentId?: string;
}) => {
  return prisma.category.create({
    data,
  });
};

// Get all top-level categories
const getCategories = async () => {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      subCategories: {
        include: {
          subCategories: {
            include: {
              subCategories: {
                include: {
                  subCategories: {
                    include: {
                      subCategories: {
                        include: {
                          subCategories: {
                            include: {
                              subCategories: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

// Get a category by ID
const getCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      subCategories: {
        include: {
          subCategories: true,
        },
      },
      accounts: true,
    },
  });
};

const getCategoryStatistics = async (id?: any, code?: number) => {
  const whereCondition: any = {};

  if (id) {
    whereCondition.id = id;
  }

  if (code) {
    whereCondition.number = code;
  }

  const statistics = await prisma.category.findUnique({
    where: whereCondition,
    include: {
      accounts: {
        include: {
          sentTransactions: true,
          receivedTransactions: true,
        },
      },
    },
  });

  if (!statistics) return null;

  const currentYear = new Date().getFullYear();
  const startOfCurrentYear = new Date(currentYear, 0, 1); // January 1st of the current year
  const endOfCurrentYear = new Date(currentYear, 11, 31, 23, 59, 59, 999); // December 31st of the current year

  let categoryCurrentYearStats = {
    sentTotal: 0,
    receivedTotal: 0,
  };

  let categoryPreviousYearsStats = {
    sentTotal: 0,
    receivedTotal: 0,
  };

  const accountsStatistics = statistics.accounts.map((account) => {
    let currentYearStats = {
      sentTotal: 0,
      receivedTotal: 0,
    };

    let previousYearsStats = {
      sentTotal: 0,
      receivedTotal: 0,
    };

    account.sentTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      if (
        transactionDate >= startOfCurrentYear &&
        transactionDate <= endOfCurrentYear
      ) {
        currentYearStats.sentTotal += transaction.amount;
        categoryCurrentYearStats.sentTotal += transaction.amount;
      } else {
        previousYearsStats.sentTotal += transaction.amount;
        categoryPreviousYearsStats.sentTotal += transaction.amount;
      }
    });

    account.receivedTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      if (
        transactionDate >= startOfCurrentYear &&
        transactionDate <= endOfCurrentYear
      ) {
        currentYearStats.receivedTotal += transaction.amount;
        categoryCurrentYearStats.receivedTotal += transaction.amount;
      } else {
        previousYearsStats.receivedTotal += transaction.amount;
        categoryPreviousYearsStats.receivedTotal += transaction.amount;
      }
    });

    return {
      accountId: account.id,
      accountNumber: account.number,
      accountName: account.name,
      currentYearStats,
      previousYearsStats,
    };
  });

  let categoryCurrentYearStatsBalance =
    categoryCurrentYearStats.sentTotal - categoryCurrentYearStats.receivedTotal;

  let categoryPreviousYearsStatsBalance =
    categoryPreviousYearsStats.sentTotal -
    categoryPreviousYearsStats.receivedTotal;

  return {
    totalBalance:
      categoryCurrentYearStatsBalance + categoryPreviousYearsStatsBalance,
    currentYear: categoryCurrentYearStats,
    previousYears: categoryPreviousYearsStats,
    accounts: accountsStatistics,
    details: statistics,
  };
};

// Get a category by Number
const getCategoryByNumber = async (number: number) => {
  return prisma.category.findUnique({
    where: { number },
    include: {
      subCategories: {
        include: {
          subCategories: true,
        },
      },
    },
  });
};

const getCategoryThatHaveAccounts = async () => {
  const categories = await prisma.category.findMany({
    where: {
      accounts: {
        some: {},
      },
    },
  });
  return categories;
};

// Update a category
const updateCategory = async (
  id: string,
  data: { name?: string; number?: number }
) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

// Delete a category
const deleteCategory = async (id: string) => {
  // Check if the category has any subcategories or accounts before deleting
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      subCategories: true,
      accounts: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.subCategories.length > 0 || category.accounts.length > 0) {
    throw new Error(
      "Cannot delete a category that has subcategories or accounts"
    );
  }

  // Proceed to delete the category
  return prisma.category.delete({
    where: { id },
  });
};

async function getCategoryTransactionSummaryForCategories(
  categoryNumbers: number[]
) {
  const currentYear = new Date().getFullYear();
  const startOfCurrentYear = new Date(`${currentYear}-01-01`);
  const startOfNextYear = new Date(`${currentYear + 1}-01-01`);

  const results = await Promise.all(
    categoryNumbers.map(async (categoryNumber) => {
      const category = await prisma.category.findUnique({
        where: {
          number: categoryNumber,
        },
        select: {
          id: true,
          name: true,
          number: true,
          accounts: {
            select: {
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
          },
        },
      });

      if (category) {
        const { id, name, number, accounts } = category;

        const thisYearSentTransactions = accounts.flatMap((account) =>
          account.sentTransactions.filter(
            (tx) =>
              tx.createdAt >= startOfCurrentYear &&
              tx.createdAt < startOfNextYear
          )
        );

        const previousYearsSentTransactions = accounts.flatMap((account) =>
          account.sentTransactions.filter(
            (tx) => tx.createdAt < startOfCurrentYear
          )
        );

        const thisYearReceivedTransactions = accounts.flatMap((account) =>
          account.receivedTransactions.filter(
            (tx) =>
              tx.createdAt >= startOfCurrentYear &&
              tx.createdAt < startOfNextYear
          )
        );

        const previousYearsReceivedTransactions = accounts.flatMap((account) =>
          account.receivedTransactions.filter(
            (tx) => tx.createdAt < startOfCurrentYear
          )
        );

        const thisYearTotalSentAmount = thisYearSentTransactions.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );

        const thisYearTotalReceivedAmount = thisYearReceivedTransactions.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );

        const previousYearsTotalSentAmount =
          previousYearsSentTransactions.reduce((sum, tx) => sum + tx.amount, 0);

        const previousYearsTotalReceivedAmount =
          previousYearsReceivedTransactions.reduce(
            (sum, tx) => sum + tx.amount,
            0
          );

        const thisYearBalance =
          thisYearTotalSentAmount - thisYearTotalReceivedAmount;

        const previousYearsBalance =
          previousYearsTotalSentAmount - previousYearsTotalReceivedAmount;

        const totalBalance = thisYearBalance + previousYearsBalance;

        return {
          id,
          categoryName: name,
          categoryNumber: number,
          totalBalance,
          thisYear: {
            totalSentTransactions: thisYearSentTransactions.length,
            totalSentAmount: thisYearTotalSentAmount,
            totalReceivedTransactions: thisYearReceivedTransactions.length,
            totalReceivedAmount: thisYearTotalReceivedAmount,
            balance: thisYearBalance,
          },
          previousYears: {
            totalSentTransactions: previousYearsSentTransactions.length,
            totalSentAmount: previousYearsTotalSentAmount,
            totalReceivedTransactions: previousYearsReceivedTransactions.length,
            totalReceivedAmount: previousYearsTotalReceivedAmount,
            balance: previousYearsBalance,
          },
        };
      }
    })
  );

  return results;
}

async function getCategoryTransactionSummary(categoryNumber?: number) {
  // Get the current date
  const currentDate = new Date();

  // Calculate the start and end dates for the current year
  const currentYearStart = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
  const currentYearEnd = new Date(
    currentDate.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999
  ); // December 31st of the current year

  // Calculate the start and end dates for the previous year
  const previousYearStart = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of the previous year
  const previousYearEnd = new Date(
    currentDate.getFullYear() - 1,
    11,
    31,
    23,
    59,
    59,
    999
  ); // December 31st of the previous year

  // Fetch all accounts that belong to the category
  const accounts = await prisma.account.findMany({
    where: {
      category: {
        number: categoryNumber,
      },
    },
    select: {
      id: true,
      name: true,
      number: true,
      sentTransactions: true,
      receivedTransactions: true,
    },
  });

  const transactionSummary = await Promise.all(
    accounts.map(async (account) => {
      // Get total sent transactions and sum for the current year
      const currentYearSent = await prisma.transaction.aggregate({
        where: {
          fromId: account.id,
          createdAt: {
            gte: currentYearStart,
            lte: currentYearEnd,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Get total sent transactions and sum for the previous year
      const previousYearSent = await prisma.transaction.aggregate({
        where: {
          fromId: account.id,
          createdAt: {
            gte: previousYearStart,
            lte: previousYearEnd,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Get total received transactions and sum for the current year
      const currentYearReceived = await prisma.transaction.aggregate({
        where: {
          toId: account.id,
          createdAt: {
            gte: currentYearStart,
            lte: currentYearEnd,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Get total received transactions and sum for the previous year
      const previousYearReceived = await prisma.transaction.aggregate({
        where: {
          toId: account.id,
          createdAt: {
            gte: previousYearStart,
            lte: previousYearEnd,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      return {
        accountName: account.name,
        currentYear: {
          sentTransactions: currentYearSent._count,
          sentAmount: currentYearSent._sum.amount ?? 0,
          receivedTransactions: currentYearReceived._count,
          receivedAmount: currentYearReceived._sum.amount ?? 0,
        },
        previousYear: {
          sentTransactions: previousYearSent._count,
          sentAmount: previousYearSent._sum.amount ?? 0,
          receivedTransactions: previousYearReceived._count,
          receivedAmount: previousYearReceived._sum.amount ?? 0,
        },
      };
    })
  );

  return transactionSummary;
}

export default {
  getCategoryTransactionSummaryForCategories,
  getCategoryTransactionSummary,
  getCategoryStatistics,
  deleteCategory,
  updateCategory,
  getCategoryThatHaveAccounts,
  getCategoryByNumber,
  createCategory,
  getCategories,
  getCategoryById,
};
