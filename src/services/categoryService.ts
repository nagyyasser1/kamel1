import getCurrentYear from "../utils/getCurrentYear";
import prisma from "../prisma";

// Create a category
const createCategory = async (data: {
  name: string;
  number: string;
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

const getCategoriesWithNums = async () => {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      number: true,
    },
  });
  return categories;
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

const getCategoryStatistics = async (id?: any, code?: string) => {
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
    categoryCurrentYearStats.receivedTotal - categoryCurrentYearStats.sentTotal;

  let categoryPreviousYearsStatsBalance =
    categoryPreviousYearsStats.receivedTotal -
    categoryPreviousYearsStats.sentTotal;

  return {
    totalBalance:
      categoryCurrentYearStatsBalance + categoryPreviousYearsStatsBalance,
    currentYear: categoryCurrentYearStats,
    previousYears: categoryPreviousYearsStats,
  };
};

// Get a category by Number
const getCategoryByNumber = async (number: string) => {
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
  data: { name?: string; number?: string }
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

async function getCategoryTransactionSummaryForAllCategories() {
  const currentYear = new Date().getFullYear();
  const startOfCurrentYear = new Date(`${currentYear}-01-01`);
  const startOfNextYear = new Date(`${currentYear + 1}-01-01`);

  // Fetch all categories and their related accounts and transactions
  const categories = await prisma.category.findMany({
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

  const results = await Promise.all(
    categories.map(async (category) => {
      const { id, name, number, accounts } = category;

      const thisYearSentTransactions = accounts.flatMap((account) =>
        account.sentTransactions.filter(
          (tx) =>
            tx.createdAt >= startOfCurrentYear && tx.createdAt < startOfNextYear
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
            tx.createdAt >= startOfCurrentYear && tx.createdAt < startOfNextYear
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

      const previousYearsTotalSentAmount = previousYearsSentTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );

      const previousYearsTotalReceivedAmount =
        previousYearsReceivedTransactions.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );

      const thisYearBalance =
        thisYearTotalReceivedAmount - thisYearTotalSentAmount;

      const previousYearsBalance =
        previousYearsTotalReceivedAmount - previousYearsTotalSentAmount;

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
    })
  );

  return results;
}

// async function getCategoryTransactionSummary(
//   categoryNumber?: string,
//   categoryName?: string
// ) {
//   let categoryFilter: any = {};

//   if (categoryName && categoryName.trim() !== "") {
//     categoryFilter.name = {
//       contains: categoryName,
//       mode: "insensitive",
//     };
//   }

//   if (categoryNumber && categoryNumber.trim() !== "") {
//     categoryFilter.number = categoryNumber;
//   }

//   // Get the current date
//   const currentDate = new Date();

//   // Calculate the start and end dates for the current and previous years
//   const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);
//   const currentYearEnd = new Date(
//     currentDate.getFullYear(),
//     11,
//     31,
//     23,
//     59,
//     59,
//     999
//   );
//   const previousYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
//   const previousYearEnd = new Date(
//     currentDate.getFullYear() - 1,
//     11,
//     31,
//     23,
//     59,
//     59,
//     999
//   );

//   // Fetch all accounts that belong to the category by filtering on category
//   const accounts = await prisma.account.findMany({
//     where: {
//       category: {
//         ...categoryFilter, // Apply the filters for category number and/or name
//       },
//     },
//     select: {
//       id: true,
//       name: true,
//       number: true,
//     },
//   });

//   if (!accounts || accounts.length === 0) {
//     return []; // Return empty array if no accounts found for the category
//   }

//   const accountIds = accounts.map((account) => account.id);

//   // Batch query: Get all current and previous year transactions in one query
//   const [currentYearTransactions, previousYearTransactions] = await Promise.all(
//     [
//       prisma.transaction.findMany({
//         where: {
//           OR: [
//             {
//               fromId: { in: accountIds },
//               createdAt: { gte: currentYearStart, lte: currentYearEnd },
//             },
//             {
//               toId: { in: accountIds },
//               createdAt: { gte: currentYearStart, lte: currentYearEnd },
//             },
//           ],
//         },
//       }),
//       prisma.transaction.findMany({
//         where: {
//           OR: [
//             {
//               fromId: { in: accountIds },
//               createdAt: { gte: previousYearStart, lte: previousYearEnd },
//             },
//             {
//               toId: { in: accountIds },
//               createdAt: { gte: previousYearStart, lte: previousYearEnd },
//             },
//           ],
//         },
//       }),
//     ]
//   );

//   // Group transactions by account ID for both current and previous years
//   const groupTransactions = (
//     transactions: any[],
//     accountId: string,
//     isReceived: boolean
//   ) => {
//     return transactions.filter((t) =>
//       isReceived ? t.toId === accountId : t.fromId === accountId
//     );
//   };

//   // Process transaction summaries for each account
//   const transactionSummary = accounts.map((account) => {
//     const currentYearSent = groupTransactions(
//       currentYearTransactions,
//       account.id,
//       false
//     );
//     const currentYearReceived = groupTransactions(
//       currentYearTransactions,
//       account.id,
//       true
//     );
//     const previousYearSent = groupTransactions(
//       previousYearTransactions,
//       account.id,
//       false
//     );
//     const previousYearReceived = groupTransactions(
//       previousYearTransactions,
//       account.id,
//       true
//     );

//     // Summing amounts for sent and received transactions
//     const sumAmount = (transactions: any[]) =>
//       transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

//     const thisYearBalance =
//       sumAmount(currentYearReceived) - sumAmount(currentYearSent);
//     const previousYearBalance =
//       sumAmount(previousYearReceived) - sumAmount(previousYearSent);
//     const totalBalance = previousYearBalance + thisYearBalance;

//     return {
//       id: account.id,
//       number: account.number,
//       name: account.name,
//       totalBalance,
//       currentYear: {
//         balance: thisYearBalance,
//         sentTransactions: currentYearSent.length,
//         sentAmount: sumAmount(currentYearSent),
//         receivedTransactions: currentYearReceived.length,
//         receivedAmount: sumAmount(currentYearReceived),
//       },
//       previousYear: {
//         balance: previousYearBalance,
//         sentTransactions: previousYearSent.length,
//         sentAmount: sumAmount(previousYearSent),
//         receivedTransactions: previousYearReceived.length,
//         receivedAmount: sumAmount(previousYearReceived),
//       },
//     };
//   });

//   return transactionSummary;
// }

async function getCategoryTransactionSummary(
  categoryNumber?: string,
  categoryName?: string
) {
  let categoryFilter: any = {};

  if (categoryName && categoryName.trim() !== "") {
    categoryFilter.name = {
      contains: categoryName,
      mode: "insensitive",
    };
  }

  if (categoryNumber && categoryNumber.trim() !== "") {
    categoryFilter.number = categoryNumber;
  }

  // Fetch the root category and its subcategories recursively
  const rootCategory = await prisma.category.findFirst({
    where: {
      ...categoryFilter,
    },
    include: {
      subCategories: {
        include: {
          subCategories: true, // Continue to include subcategories at deeper levels
        },
      },
    },
  });

  if (!rootCategory) {
    return []; // Return an empty array if no matching category is found
  }

  // Recursively fetch all subcategory IDs
  const fetchAllSubCategoryIds = (category: any): string[] => {
    const ids = [category.id];
    if (category.subCategories && category.subCategories.length > 0) {
      for (const subCategory of category.subCategories) {
        ids.push(...fetchAllSubCategoryIds(subCategory));
      }
    }
    return ids;
  };

  const categoryIds = fetchAllSubCategoryIds(rootCategory);

  // Get the current date
  const currentDate = new Date();

  // Calculate the start and end dates for the current and previous years
  const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);
  const currentYearEnd = new Date(
    currentDate.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999
  );
  const previousYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
  const previousYearEnd = new Date(
    currentDate.getFullYear() - 1,
    11,
    31,
    23,
    59,
    59,
    999
  );

  // Fetch all accounts that belong to any of the subcategories (or the root category)
  const accounts = await prisma.account.findMany({
    where: {
      categoryId: {
        in: categoryIds, // Find accounts belonging to the root or any subcategory
      },
    },
    select: {
      id: true,
      name: true,
      number: true,
    },
  });

  if (!accounts || accounts.length === 0) {
    return []; // Return empty array if no accounts found for the category
  }

  const accountIds = accounts.map((account) => account.id);

  // Batch query: Get all current and previous year transactions in one query
  const [currentYearTransactions, previousYearTransactions] = await Promise.all(
    [
      prisma.transaction.findMany({
        where: {
          OR: [
            {
              fromId: { in: accountIds },
              createdAt: { gte: currentYearStart, lte: currentYearEnd },
            },
            {
              toId: { in: accountIds },
              createdAt: { gte: currentYearStart, lte: currentYearEnd },
            },
          ],
        },
      }),
      prisma.transaction.findMany({
        where: {
          OR: [
            {
              fromId: { in: accountIds },
              createdAt: { gte: previousYearStart, lte: previousYearEnd },
            },
            {
              toId: { in: accountIds },
              createdAt: { gte: previousYearStart, lte: previousYearEnd },
            },
          ],
        },
      }),
    ]
  );

  // Group transactions by account ID for both current and previous years
  const groupTransactions = (
    transactions: any[],
    accountId: string,
    isReceived: boolean
  ) => {
    return transactions.filter((t) =>
      isReceived ? t.toId === accountId : t.fromId === accountId
    );
  };

  // Process transaction summaries for each account
  const transactionSummary = accounts.map((account) => {
    const currentYearSent = groupTransactions(
      currentYearTransactions,
      account.id,
      false
    );
    const currentYearReceived = groupTransactions(
      currentYearTransactions,
      account.id,
      true
    );
    const previousYearSent = groupTransactions(
      previousYearTransactions,
      account.id,
      false
    );
    const previousYearReceived = groupTransactions(
      previousYearTransactions,
      account.id,
      true
    );

    // Summing amounts for sent and received transactions
    const sumAmount = (transactions: any[]) =>
      transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const thisYearBalance =
      sumAmount(currentYearReceived) - sumAmount(currentYearSent);
    const previousYearBalance =
      sumAmount(previousYearReceived) - sumAmount(previousYearSent);
    const totalBalance = previousYearBalance + thisYearBalance;

    return {
      id: account.id,
      number: account.number,
      name: account.name,
      totalBalance,
      currentYear: {
        balance: thisYearBalance,
        sentTransactions: currentYearSent.length,
        sentAmount: sumAmount(currentYearSent),
        receivedTransactions: currentYearReceived.length,
        receivedAmount: sumAmount(currentYearReceived),
      },
      previousYear: {
        balance: previousYearBalance,
        sentTransactions: previousYearSent.length,
        sentAmount: sumAmount(previousYearSent),
        receivedTransactions: previousYearReceived.length,
        receivedAmount: sumAmount(previousYearReceived),
      },
    };
  });

  return transactionSummary;
}

const getCategoriesBalances = async () => {
  const { currentYear, startOfYear, endOfYear } = getCurrentYear();

  // Helper function to fetch categories along with their subcategories and balances
  const fetchCategoryWithSubcategories = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        number: true,
        parentId: true,
        accounts: {
          select: {
            sentTransactions: {
              where: {
                createdAt: {
                  gte: startOfYear,
                  lte: endOfYear,
                },
              },
              select: {
                amount: true,
              },
            },
            receivedTransactions: {
              where: {
                createdAt: {
                  gte: startOfYear,
                  lte: endOfYear,
                },
              },
              select: {
                amount: true,
              },
            },
          },
        },
        subCategories: {
          select: {
            id: true,
            name: true,
            number: true,
          },
        },
      },
    });

    // Calculate the balance for the current category's own accounts
    let totalSent = 0;
    let totalReceived = 0;

    category?.accounts.forEach((account) => {
      totalSent += account.sentTransactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );
      totalReceived += account.receivedTransactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );
    });

    let balance = totalReceived - totalSent;

    // Fetch subcategories and calculate their balances recursively
    const subCategoryBalances: any = await Promise.all(
      category?.subCategories.map(async (subCategory) => {
        return await fetchCategoryWithSubcategories(subCategory.id);
      }) || []
    );

    // Add subcategories' balances to the parent category balance
    subCategoryBalances.forEach((subCategory: any) => {
      balance += subCategory.balance;
    });

    return {
      id: category?.id,
      name: category?.name,
      number: category?.number,
      balance,
      subCategories: subCategoryBalances, // Subcategories with their balances
    };
  };

  // Fetch top-level categories (those without a parent)
  const topLevelCategories = await prisma.category.findMany({
    where: {
      parentId: null, // Top-level categories have no parent
    },
    select: {
      id: true,
    },
  });

  // Fetch each top-level category along with its subcategories and calculate balance
  const categoriesWithBalances = await Promise.all(
    topLevelCategories.map(async (category) => {
      return await fetchCategoryWithSubcategories(category.id);
    })
  );

  return categoriesWithBalances;
};

const getCategoryBalance = async (categoryNumber: string) => {
  const { startOfYear } = getCurrentYear();

  // Helper function to recursively calculate category and subcategory balances
  const calculateCategoryBalance = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        subCategories: {
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
            subCategories: {
              select: {
                id: true,
              },
            },
          },
        },
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

    let thisYearSent = 0;
    let thisYearReceived = 0;
    let previousYearsSent = 0;
    let previousYearsReceived = 0;

    // Calculate balance for the category's own accounts
    category?.accounts.forEach((account) => {
      account.sentTransactions.forEach((transaction) => {
        if (transaction.createdAt >= startOfYear) {
          thisYearSent += transaction.amount;
        } else {
          previousYearsSent += transaction.amount;
        }
      });

      account.receivedTransactions.forEach((transaction) => {
        if (transaction.createdAt >= startOfYear) {
          thisYearReceived += transaction.amount;
        } else {
          previousYearsReceived += transaction.amount;
        }
      });
    });

    // Recursively calculate balances for subcategories
    for (const subCategory of category?.subCategories || []) {
      const subCategoryBalance = await calculateCategoryBalance(subCategory.id);
      thisYearSent += subCategoryBalance.thisYearSent;
      thisYearReceived += subCategoryBalance.thisYearReceived;
      previousYearsSent += subCategoryBalance.previousYearsSent;
      previousYearsReceived += subCategoryBalance.previousYearsReceived;
    }

    return {
      thisYearSent,
      thisYearReceived,
      previousYearsSent,
      previousYearsReceived,
    };
  };

  // Find the category by its number
  const category = await prisma.category.findUnique({
    where: {
      number: categoryNumber,
    },
    select: {
      id: true,
      name: true,
      number: true,
      subCategories: {
        select: {
          id: true,
          name: true,
          number: true,
        },
      },
    },
  });

  if (!category) {
    console.log(`Category with number ${categoryNumber} not found`);
    return {
      category: {
        id: 0,
        name: "",
        number: "",
      },
      thisYearBalance: 0,
      previousYearsBalance: 0,
    };
  } else {
    // Calculate total balance for the category and its subcategories
    const totalBalance = await calculateCategoryBalance(category.id);

    const thisYearBalance =
      totalBalance.thisYearReceived - totalBalance.thisYearSent;

    const previousYearsBalance =
      totalBalance.previousYearsReceived - totalBalance.previousYearsSent;

    return {
      category: {
        id: category.id,
        name: category.name,
        number: category.number,
      },
      thisYearBalance,
      previousYearsBalance,
    };
  }
};

export default {
  getCategoryTransactionSummaryForAllCategories,
  getCategoryTransactionSummary,
  getCategoryStatistics,
  deleteCategory,
  updateCategory,
  getCategoryThatHaveAccounts,
  getCategoryByNumber,
  createCategory,
  getCategories,
  getCategoryById,
  getCategoriesBalances,
  getCategoryBalance,
  getCategoriesWithNums,
};
