import prisma from "../prisma";

// Types
export interface ProductInput {
  name: string;
  number: number;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  number?: number;
}

// Create Product
const createProduct = async (data: ProductInput) => {
  return prisma.product.create({
    data,
  });
};

// Get All Products
const getAllProducts = async () => {
  return prisma.product.findMany();
};

const getAllProductsWithTrans = async () => {
  return prisma.product.findMany({
    include: {
      ProductTransaction: true,
    },
  });
};

// Get Product By ID
const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

// Update Product
const updateProduct = async (data: UpdateProductInput) => {
  const { id, ...updates } = data;
  return prisma.product.update({
    where: { id },
    data: updates,
  });
};

// Delete Product
const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsWithTrans,
};
