import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig";
import { JWT_PAYLOAD } from "../types";
import { STATUS_CODES } from "../constants/statusCodes";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "No token, authorization denied" });
  }

  try {
    const user = jwt.verify(token, appConfig.jwtSecret) as JWT_PAYLOAD;
    res.locals = user;

    next();
  } catch (err) {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
