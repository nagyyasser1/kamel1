import prisma from "../prisma";

// Create a transaction
export const createTransaction = async (data: {
  amount: number;
  fromAccountId: string;
  toAccountId: string;
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

// Get all transactions
export const getAllTransactions = async () => {
  return await prisma.transaction.findMany();
};

// Get a transaction by ID
export const getTransactionById = async (id: string) => {
  return await prisma.transaction.findUnique({
    where: { id },
  });
};
