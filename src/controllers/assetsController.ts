import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as assetsService from "../services/assetsService";
import CustomError from "../utils/CustomError";

const createAssetCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assetExists = await assetsService.getAssetByCode(req.body?.code);
    if (assetExists) {
      throw new CustomError(
        `asset with ${assetExists.code} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
    }
    const asset = await assetsService.createAsset(req.body);
    res.status(STATUS_CODES.CREATED).json(asset);
  } catch (error) {
    next(error);
  }
};

const updateAssetCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const asset = await assetsService.updateAsset(id, req.body);
    res.status(STATUS_CODES.OK).json(asset);
  } catch (error) {
    next(error);
  }
};

const deleteAssetCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await assetsService.deleteAsset(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllAssetsCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assets = await assetsService.getAllAssets();
    res.status(STATUS_CODES.OK).json(assets);
  } catch (error) {
    next(error);
  }
};

const getAssetByIdCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const asset = await assetsService.getAssetById(id);
    if (asset) {
      res.status(STATUS_CODES.OK).json(asset);
    } else {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: "Asset not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createAssetCtr,
  updateAssetCtr,
  deleteAssetCtr,
  getAllAssetsCtr,
  getAssetByIdCtr,
};
