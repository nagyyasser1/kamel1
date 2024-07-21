import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { STATUS_CODES } from "../constants/statusCodes";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10, role } = req.query;

  try {
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const users = await userService.getAllUsers(
      pageNumber,
      limitNumber,
      role as string
    );
    res.status(STATUS_CODES.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(STATUS_CODES.OK).json(user);
    } else {
      res.status(STATUS_CODES.NOT_FOUND).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(STATUS_CODES.CREATED).json(newUser);
  } catch (error: any) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(STATUS_CODES.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
