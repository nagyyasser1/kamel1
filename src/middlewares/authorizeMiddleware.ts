import { STATUS_CODES } from "../constants/statusCodes";
import { Request, Response, NextFunction } from "express";

const authorizeMiddleware =
  (allowedRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals;

    if (!user || user.role !== allowedRole) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Forbidden" });
    }

    next();
  };

export default authorizeMiddleware;
