import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as suppliersService from "../services/suppliersService";

const createSupplierCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplier = await suppliersService.createSupplier(req.body);
    res.status(STATUS_CODES.CREATED).json(supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplierCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const supplier = await suppliersService.updateSupplier(id, req.body);
    res.status(STATUS_CODES.OK).json(supplier);
  } catch (error) {
    next(error);
  }
};

const deleteSupplierCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await suppliersService.deleteSupplier(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllSuppliersCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await suppliersService.getAllSuppliers();
    res.status(STATUS_CODES.OK).json(suppliers);
  } catch (error) {
    next(error);
  }
};

const getSupplierByIdCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const supplier = await suppliersService.getSupplierById(id);
    if (supplier) {
      res.status(STATUS_CODES.OK).json(supplier);
    } else {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Supplier not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createSupplierCtr,
  updateSupplierCtr,
  deleteSupplierCtr,
  getAllSuppliersCtr,
  getSupplierByIdCtr,
};
