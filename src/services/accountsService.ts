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
              createdAt: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
              },
            },
          },
          receivedTransactions: {
            where: {
              createdAt: {
                gte: new Date(`${year}-01-01`),
                lt: new Date(`${year + 1}-01-01`),
              },
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

    category.accounts.forEach((account) => {
      account.sentTransactions.forEach((transaction) => {
        const month = transaction.createdAt.getMonth();
        monthlySummary[month].totalSentTransactions += 1;
        monthlySummary[month].totalSentAmount += BigInt(transaction.amount);
      });

      account.receivedTransactions.forEach((transaction) => {
        const month = transaction.createdAt.getMonth();
        monthlySummary[month].totalReceivedTransactions += 1;
        monthlySummary[month].totalReceivedAmount += BigInt(transaction.amount);
      });
    });

    return {
      categoryId: category.id,
      categoryName: category.name,
      monthlySummary: monthlySummary.map((monthData) => ({
        ...monthData,
        totalSentAmount: Number(monthData.totalSentAmount),
        totalReceivedAmount: Number(monthData.totalReceivedAmount),
      })),
    };
  });

  return summary;
}
