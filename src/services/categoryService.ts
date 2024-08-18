import prisma from "../prisma";

// Create a category
export const createCategory = async (data: {
  name: string;
  number: number;
  parentId?: string;
}) => {
  return prisma.category.create({
    data,
  });
};

// Get all top-level categories
export const getCategories = async () => {
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
export const getCategoryById = async (id: string) => {
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

// Get a category by Number
export const getCategoryByNumber = async (number: number) => {
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

export const getCategoryThatHaveAccounts = async () => {
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
export const updateCategory = async (
  id: string,
  data: { name?: string; number?: number }
) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

// Delete a category
export const deleteCategory = async (id: string) => {
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

export async function getCategoryTransactionSummaryForCategories() {
  const categoryNumbers: number[] = [1203, 1204, 1207, 4101, 4102, 4103];
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
          name: true,
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

      if (!category) {
        throw new Error(`Category with number ${categoryNumber} not found`);
      }

      const { name, accounts } = category;

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

      return {
        categoryName: name,
        thisYear: {
          totalSentTransactions: thisYearSentTransactions.length,
          totalSentAmount: thisYearSentTransactions.reduce(
            (sum, tx) => sum + tx.amount,
            0
          ),
          totalReceivedTransactions: thisYearReceivedTransactions.length,
          totalReceivedAmount: thisYearReceivedTransactions.reduce(
            (sum, tx) => sum + tx.amount,
            0
          ),
        },
        previousYears: {
          totalSentTransactions: previousYearsSentTransactions.length,
          totalSentAmount: previousYearsSentTransactions.reduce(
            (sum, tx) => sum + tx.amount,
            0
          ),
          totalReceivedTransactions: previousYearsReceivedTransactions.length,
          totalReceivedAmount: previousYearsReceivedTransactions.reduce(
            (sum, tx) => sum + tx.amount,
            0
          ),
        },
      };
    })
  );

  return results;
}
