import { Router } from "express";
import productValidators from "../utils/validations/productValidators";
import productController from "../controllers/product.controller";
const router = Router();

router.post(
  "/",
  productValidators.validateCreateProduct,
  productController.createProduct
);
router.get("/", productController.getAllProducts);
router.get("/search", productController.getAllProductsBySearch);
router.get("/stats", productController.getAllProductsStats);
router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
