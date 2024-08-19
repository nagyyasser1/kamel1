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
