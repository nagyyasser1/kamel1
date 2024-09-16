import { Request, Response } from "express";
import ProductService from "../services/product.service";

// Controller to create a product
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Controller to get all products
const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Controller to get a product by ID
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Product not found" });
  }
};

// Controller to update a product
const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await ProductService.updateProduct(req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Controller to delete a product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Controller to delete a product
const getAllProductsStats = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getProductBalance();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

const getAllProductsBySearch = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).send("provide name in the query.");
    }

    const result = await ProductService.getProductByName(name as string);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsStats,
  getAllProductsBySearch,
};
