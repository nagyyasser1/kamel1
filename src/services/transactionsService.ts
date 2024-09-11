import getCurrentYear from "../utils/getCurrentYear";
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

export const getAllTransactionsByDay = async () => {
  const now = new Date();

  // Start of the day (00:00:00)
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  // End of the day (23:59:59)
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  return await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      from: true,
      to: true,
    },
  });
};

const getCategoryBalanceByNumber = async (categoryNumber: number) => {
  const { currentYear } = getCurrentYear();

  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
        {
          OR: [
            { from: { category: { number: categoryNumber } } },
            { to: { category: { number: categoryNumber } } },
          ],
        },
      ],
    },
    select: {
      amount: true,
      from: {
        select: {
          category: { select: { number: true } },
        },
      },
      to: {
        select: {
          category: { select: { number: true } },
        },
      },
    },
  });

  // Calculate the balance
  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.from?.category?.number === categoryNumber) {
      acc -= transaction.amount;
    }
    if (transaction.to?.category?.number === categoryNumber) {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  return balance;
};

const getAccountBalanceByNumber = async (accountNumber: number) => {
  const { currentYear } = getCurrentYear();

  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
        {
          OR: [
            { from: { number: accountNumber } },
            { to: { number: accountNumber } },
          ],
        },
      ],
    },
    select: {
      amount: true,
      from: { select: { number: true } },
      to: { select: { number: true } },
    },
  });

  // Calculate the balance
  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.from.number === accountNumber) {
      acc -= transaction.amount; // Subtract if the account is the sender
    }
    if (transaction.to.number === accountNumber) {
      acc += transaction.amount; // Add if the account is the receiver
    }
    return acc;
  }, 0);

  return balance;
};

const getAccountsBalanceByNumbers = async (accountNumbers: number[]) => {
  const { currentYear } = getCurrentYear();

  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    },
    select: {
      amount: true,
      from: { select: { number: true } },
      to: { select: { number: true } },
    },
  });

  // Calculate the balance for all provided account numbers
  const balance = transactions.reduce((acc, transaction) => {
    if (accountNumbers.includes(transaction.from.number)) {
      acc -= transaction.amount; // Subtract if the account is the sender
    }
    if (accountNumbers.includes(transaction.to.number)) {
      acc += transaction.amount; // Add if the account is the receiver
    }
    return acc;
  }, 0);

  return balance;
};

const getCategoriesBalance = async (categoryNumbers: number[]) => {
  // First, find all account numbers that belong to the given categories
  const accounts = await prisma.account.findMany({
    where: {
      category: { number: { in: categoryNumbers } },
    },
    select: {
      number: true,
    },
  });

  const accountNumbers = accounts.map((account) => account.number);

  if (accountNumbers.length === 0) {
    return 0; // No accounts found for the given categories
  }

  // Use the previously defined getAccountsBalanceByNumbers function to calculate the balance
  const balance = await getAccountsBalanceByNumbers(accountNumbers);

  return balance;
};

const getAccountsWithBalance = async (accountNumbers: number[]) => {
  const { currentYear } = getCurrentYear();

  // Fetch account details
  const accounts = await prisma.account.findMany({
    where: {
      number: { in: accountNumbers },
    },
    select: {
      number: true,
      name: true,
    },
  });

  const accountNumbersList = accounts.map((account) => account.number);

  if (accountNumbersList.length === 0) {
    return []; // No accounts found
  }

  // Fetch transactions and calculate balance
  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
        {
          OR: [
            { from: { number: { in: accountNumbersList } } },
            { to: { number: { in: accountNumbersList } } },
          ],
        },
      ],
    },
    select: {
      amount: true,
      from: { select: { number: true } },
      to: { select: { number: true } },
    },
  });

  // Calculate balance for each account
  const balances = accounts.map((account) => {
    const accountTransactions = transactions.filter(
      (transaction) =>
        transaction.from.number === account.number ||
        transaction.to.number === account.number
    );

    const balance = accountTransactions.reduce((acc, transaction) => {
      if (transaction.from.number === account.number) {
        acc -= transaction.amount; // Subtract if the account is the sender
      }
      if (transaction.to.number === account.number) {
        acc += transaction.amount; // Add if the account is the receiver
      }
      return acc;
    }, 0);

    return {
      number: account.number,
      name: account.name,
      balance,
    };
  });

  return balances;
};

const getCategoriesWithBalance = async (categoryNumbers: number[]) => {
  const { currentYear } = getCurrentYear();

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: {
      number: { in: categoryNumbers },
    },
    select: {
      number: true,
      name: true,
    },
  });

  const categoryNumbersList = categories.map((category) => category.number);

  if (categoryNumbersList.length === 0) {
    return []; // No categories found
  }

  // Fetch accounts for these categories
  const accounts = await prisma.account.findMany({
    where: {
      category: { number: { in: categoryNumbersList } },
    },
    select: {
      number: true,
      category: {
        select: {
          number: true,
        },
      },
    },
  });

  const accountNumbersList = accounts.map((account) => account.number);

  // Fetch transactions for these accounts
  const transactions = await prisma.transaction.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
        {
          OR: [
            { from: { number: { in: accountNumbersList } } },
            { to: { number: { in: accountNumbersList } } },
          ],
        },
      ],
    },
    select: {
      amount: true,
      from: {
        select: { number: true, category: { select: { number: true } } },
      },
      to: { select: { number: true, category: { select: { number: true } } } },
    },
  });

  // Calculate balance for each category
  const balances = categories.map((category) => {
    // Get account numbers that belong to the current category
    const categoryAccountNumbers = accounts
      .filter((account) => account.category?.number === category.number)
      .map((account) => account.number);

    // Filter transactions for these account numbers
    const categoryTransactions = transactions.filter(
      (transaction) =>
        categoryAccountNumbers.includes(transaction.from.number) ||
        categoryAccountNumbers.includes(transaction.to.number)
    );

    // Calculate the balance
    const balance = categoryTransactions.reduce((acc, transaction) => {
      if (transaction.from.category?.number === category.number) {
        acc -= transaction.amount; // Subtract if the account is the sender's category
      }
      if (transaction.to.category?.number === category.number) {
        acc += transaction.amount; // Add if the account is the receiver's category
      }
      return acc;
    }, 0);

    return {
      number: category.number,
      name: category.name,
      balance,
    };
  });

  return balances;
};

export default {
  getCategoryBalanceByNumber,
  getAccountBalanceByNumber,
  getAccountsBalanceByNumbers,
  getAccountsWithBalance,
  getCategoriesBalance,
  getCategoriesWithBalance,
};
