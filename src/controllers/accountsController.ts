import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";
import entryExists from "../utils/entryExists.util";
import { EntryType } from "../utils/enums";
import sumGroupOfAccounts from "../utils/sumGroupOfAccounts";
import { AccountsWname } from "../constants/accountsCodes";
import { Account } from "../types";

const createAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categroyExists = await entryExists(
      EntryType.category,
      req.body?.categoryId
    );

    if (!categroyExists) {
      throw new CustomError(
        `category with id:${req.body?.categoryId} not found!.`,
        STATUS_CODES.NOT_FOUND
      );
    }

    const existingAccount = await accountsService.getAccountByName(
      req.body?.name
    );

    if (existingAccount) {
      throw new CustomError(
        `Account with name ${existingAccount.name} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
    }

    const existingAccountByNumber = await accountsService.getAccountByNumber(
      req.body?.number
    );

    if (existingAccountByNumber) {
      throw new CustomError(
        `Account with number ${existingAccountByNumber.number} aready exists!.`,
        STATUS_CODES.CONFLICT
      );
    }

    const account = await accountsService.createAccount(req.body);
    res.status(STATUS_CODES.CREATED).json(account);
  } catch (error) {
    next(error);
  }
};

const deleteAccountCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await accountsService.deleteAccount(id);
    res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

const getAllAccountsCtr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categroyId, name } = req.query;
    const accounts = await accountsService.getAllAccounts(
      categroyId as string,
      name as string
    );
    res.status(STATUS_CODES.OK).json(accounts);
  } catch (error) {
    next(error);
  }
};

const getAccountById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await accountsService.getAccountById(req.params?.id);
    if (!account) {
      throw new CustomError(
        `account with id:${req.params?.id} not found`,
        STATUS_CODES.NOT_FOUND
      );
    }

    res.status(STATUS_CODES.OK).send(account);
  } catch (error) {
    next(error);
  }
};

export const getTransactionsSummaryForCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { year } = req.query;

    if (!year) {
      throw new CustomError(
        "year query must be provided!",
        STATUS_CODES.BAD_REQUEST
      );
    }

    const result = await accountsService.getCategoryTransactionSummary(
      Number(year)
    );
    res.status(STATUS_CODES.OK).send(result);
  } catch (error) {
    next(error);
  }
};

const getTransForAccountsByNums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summaries =
      await accountsService.getTransactionsSummaryForArrayOfAccountsNumber();

    const NetSales =
      sumGroupOfAccounts(summaries, [AccountsWname.sales]) -
      Math.abs(
        sumGroupOfAccounts(summaries, [
          AccountsWname.allowedDiscount,
          AccountsWname.salesReturns,
        ])
      );

    const purchasesReturnedExpenses = sumGroupOfAccounts(summaries, [
      AccountsWname.purchases,
      AccountsWname.purchaseReturns,
      AccountsWname.purchasesExpenses,
    ]);

    const inventoryAtTheEndOfThePeriod = sumGroupOfAccounts(summaries, [
      AccountsWname.inventoryAtTheEndOfThePeriod,
    ]);
    //

    const otherRevenues = sumGroupOfAccounts(summaries, [
      AccountsWname.otherRevenues1,
      AccountsWname.otherRevenues2,
    ]);

    const activitySalesRevenue = sumGroupOfAccounts(summaries, [
      AccountsWname.activitySalesRevenue1,
      AccountsWname.activitySalesRevenue2,
      AccountsWname.activitySalesRevenue3,
    ]);

    const totalSellingAndDistributionExpenses = sumGroupOfAccounts(summaries, [
      AccountsWname.freeSamplesAndGifts,
      AccountsWname.propagandaAndAdvertising,
      AccountsWname.sellingAgentsCommission,
      AccountsWname.shippingAndDeliveryOfOrders,
      AccountsWname.damagedAndFinishedGoods,
      AccountsWname.inventoryAdjustments,
      AccountsWname.packagingAndPackingExpenses,
    ]);

    const totalGeneralAdministrativeAndOperatingExpenses = sumGroupOfAccounts(
      summaries,
      [
        AccountsWname.salariesOfExecutivesAndOfficials,
        AccountsWname.travelAndTransportation,
        AccountsWname.bankCommissions,
        AccountsWname.accountingAuditAndConsultingExpenses,
        AccountsWname.rewardsAndPerks,
        AccountsWname.workPermits,
        AccountsWname.travelTickets,
        AccountsWname.compensationForLeavingService,
        AccountsWname.badDebts,
        AccountsWname.healthInsurance,
        AccountsWname.currencyConversionDifferences,
        AccountsWname.otherMiscellaneousExpenses,
        AccountsWname.stationeryAndPublications,
        AccountsWname.hospitalityAndReception,
        AccountsWname.socialInsurance,
        AccountsWname.trafficViolations,
        AccountsWname.treatmentAndMedicalExamination,
        AccountsWname.cleaningExpenses,
        AccountsWname.governmentFees,
        AccountsWname.carWash,
        AccountsWname.carFuel,
        AccountsWname.rentals,
        AccountsWname.electricityAndWater,
        AccountsWname.wagesAndSalaries,
        AccountsWname.generalMaintenanceExpenses,
        AccountsWname.telephoneMailInternet,
      ]
    );

    const Allotments = sumGroupOfAccounts(summaries, [
      AccountsWname.transportationDepreciationExpense,
      AccountsWname.hardwareSoftwareDepreciationExpense,
      AccountsWname.furnitureFurnishingsDepreciationExpense,
      AccountsWname.depreciationExpenseForMachineryEquipment,
    ]);

    const salesOutputTax = sumGroupOfAccounts(summaries, [
      AccountsWname.salesOutputTax,
    ]);

    const accountsObject = summaries.reduce((acc, account) => {
      if (account) {
        acc[account?.accountCode] = account;
      }
      return acc;
    }, {} as Record<string, Account>);

    res.json({
      NetSales,
      purchasesReturnedExpenses,
      inventoryAtTheEndOfThePeriod,
      otherRevenues,
      activitySalesRevenue,
      totalSellingAndDistributionExpenses,
      totalGeneralAdministrativeAndOperatingExpenses,
      Allotments,
      salesOutputTax,
      accountsObject,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
  getAccountById,
  getTransactionsSummaryForCategories,
  getTransForAccountsByNums,
};
