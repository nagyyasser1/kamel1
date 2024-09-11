import categoryService from "../services/categoryService";
import accountsService from "../services/accountsService";
import { NextFunction, Request, Response } from "express";
import { accounts } from "../constants/accountsCodes";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountsObject } = await accountsService.getAccountBalances();
    const { categoriesObject } = await categoryService.getCategoryBalances();

    const safi_almabieat =
      accountsObject[accounts.sales].balance -
      (accountsObject[accounts.allowedDiscount].balance -
        accountsObject[accounts.salesReturns].balance);

    const tukalifuh_almabieat = res.json({
      safi_almabieat,
    });
  } catch (error) {
    next(error);
  }
};
