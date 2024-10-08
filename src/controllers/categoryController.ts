import { NextFunction, Request, Response } from "express";
import categoryService from "../services/categoryService";
import CustomError from "../utils/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryExists = await categoryService.getCategoryByNumber(
      String(req.body?.number)
    );
    if (categoryExists) {
      throw new CustomError(
        `category with ${categoryExists.number} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
    }
    const category = await categoryService.createCategory(req.body);
    res.status(STATUS_CODES.CREATED).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { hasAccounts } = req.query;
    let categories;

    if (hasAccounts === "true") {
      categories = await categoryService.getCategoryThatHaveAccounts();
    } else {
      categories = await categoryService.getCategories();
    }

    res.status(STATUS_CODES.OK).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoriesWithNumsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await categoryService.getCategoriesWithNums();
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      throw new CustomError(`category not found`, STATUS_CODES.NOT_FOUND);
    }
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const categoryStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, code } = req.query;

    if (!id && !code)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "id or code must be provided in the query!",
      });

    // Convert id to string or undefined
    const categoryId = typeof id === "string" ? id : undefined;

    // Convert code to number or undefined
    const categoryCode = typeof code === "string" ? code : undefined;

    if (categoryCode) {
      if (categoryCode as string) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          message: "Invalid code provided. It must be a number.",
        });
      }
    }

    const result = await categoryService.getCategoryStatistics(
      categoryId,
      categoryCode
    );
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryTransactionSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, name } = req.query;

    if (!code && !name)
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "category 'code' or 'name' must be provided in the query!",
      });

    console.log(code);
    console.log(name);
    const result = await categoryService.getCategoryTransactionSummary(
      code as string,
      name as string
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getCategoriesWithNumsController,
};
