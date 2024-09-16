import ProductModel from "../models/product.model";
import productModel, {
  ProductInput,
  UpdateProductInput,
} from "../models/product.model";
import prisma from "../prisma";

// Service to create a product
const createProduct = async (data: ProductInput) => {
  return await ProductModel.createProduct(data);
};

// Service to get all products
const getAllProducts = async () => {
  return await ProductModel.getAllProducts();
};

// Service to get a product by ID
const getProductById = async (id: string) => {
  return await ProductModel.getProductById(id);
};

// Service to update a product
const updateProduct = async (data: UpdateProductInput) => {
  return await ProductModel.updateProduct(data);
};

// Service to delete a product
const deleteProduct = async (id: string) => {
  return await ProductModel.deleteProduct(id);
};

// Utility function to get the start of the current day
const getStartOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // Midnight of today
};

// Utility function to get the end of the current day
const getEndOfToday = (): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  ); // End of today
};

// Service to get all products and calculate balances
const getAllProductsWithBalances = async () => {
  // Get today's start and end times
  const todayStart = getStartOfToday();
  const todayEnd = getEndOfToday();

  // Fetch all products and their transactions
  const products = await productModel.getAllProductsWithTrans();

  // Calculate balances for each product
  const productsWithBalances = products.map((product) => {
    const allTransactions = product.ProductTransaction;

    // Calculate total balance (all days)
    const totalBalance = allTransactions.reduce((acc, transaction) => {
      return acc + Math.abs(transaction.income - transaction.outcome);
    }, 0);

    // Filter transactions for the current day
    const todayTransactions = allTransactions.filter(
      (transaction) =>
        transaction.createdAt >= todayStart && transaction.createdAt <= todayEnd
    );

    // Calculate today's balance
    const todayBalance = todayTransactions.reduce((acc, transaction) => {
      return acc + Math.abs(transaction.income - transaction.outcome);
    }, 0);

    const { ProductTransaction, ...data } = product;
    return {
      id: data.id,
      name: data.name,
      number: data.number,
      totalBalance,
      todayBalance,
    };
  });

  return productsWithBalances;
};

async function getProductBalance() {
  // Get start and end of the current day in plain TypeScript
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  ); // Midnight (00:00:00)
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  ); // End of day (23:59:59)

  // Query for current day transactions
  const currentDayTransactions = await prisma.product.findMany({
    include: {
      ProductTransaction: {
        where: {
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        select: {
          income: true,
          outcome: true,
        },
      },
    },
  });

  // Query for all days transactions
  const allDayTransactions = await prisma.product.findMany({
    include: {
      ProductTransaction: {
        select: {
          income: true,
          outcome: true,
        },
      },
    },
  });

  // Format the result
  const result = currentDayTransactions.map((product) => {
    const currentIncome = product.ProductTransaction.reduce(
      (sum, txn) => sum + txn.income,
      0
    );
    const currentOutcome = product.ProductTransaction.reduce(
      (sum, txn) => sum + txn.outcome,
      0
    );

    const allProduct = allDayTransactions.find((p) => p.id === product.id);
    const allIncome =
      allProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.income,
        0
      ) || 0;
    const allOutcome =
      allProduct?.ProductTransaction.reduce(
        (sum, txn) => sum + txn.outcome,
        0
      ) || 0;

    return {
      id: product.id,
      name: product.name,
      current: {
        totalincome: currentIncome,
        totaloutcome: currentOutcome,
        balance: currentIncome - currentOutcome,
      },
      all: {
        totalincome: allIncome,
        totaloutcome: allOutcome,
        balance: allIncome - allOutcome,
      },
    };
  });

  return result;
}

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsWithBalances,
  getProductBalance,
};
