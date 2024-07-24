import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as clientsService from "../services/clientsService";
import CustomError from "../utils/CustomError";

const createClientCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientExists = await clientsService.getClientByEmail(req.body?.email);
    if (clientExists) {
      throw new CustomError(
        `email: ${clientExists.email} aready exists!`,
        STATUS_CODES.CONFLICT
      );
    }
    const client = await clientsService.createClient(req.body);
    res.status(STATUS_CODES.CREATED).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClientCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const client = await clientsService.updateClient(id, req.body);
    res.status(STATUS_CODES.OK).json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClientCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await clientsService.deleteClient(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllClientsCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await clientsService.getAllClients();
    res.status(STATUS_CODES.OK).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientByIdCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const client = await clientsService.getClientById(id);
    if (client) {
      res.status(STATUS_CODES.OK).json(client);
    } else {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: "Client not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createClientCtr,
  updateClientCtr,
  deleteClientCtr,
  getAllClientsCtr,
  getClientByIdCtr,
};
