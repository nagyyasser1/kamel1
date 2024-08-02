import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import CustomError from "../utils/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryExists = await categoryService.getCategoryByNumber(
      Number(req.body?.number)
    );
    if (categoryExists) {
      throw new CustomError(
        `asset with ${categoryExists.number} aready exists!.`,
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
