import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";
import entryExists from "../utils/entryExists.util";
import { EntryType } from "../utils/enums";
import sumGroupOfAccounts from "../utils/sumGroupOfAccounts";
import {
  AccountsWname,
  CategoryWname,
  FP_accounts_names,
  FP_categories_codes,
  FP_categories_names,
} from "../constants/accountsCodes";
import { Account } from "../types";
import sumGroupOfAccountsWithCustomPercentage from "../utils/sumGroupOfAccountsWithCustomPercentage";
import categoryService from "../services/categoryService";
import sumFpAccounts from "../utils/sumFb";

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
      sumGroupOfAccounts(summaries, [
        AccountsWname.allowedDiscount,
        AccountsWname.salesReturns,
      ]);

    const purchasesReturnedExpenses = sumGroupOfAccounts(summaries, [
      AccountsWname.purchases,
      AccountsWname.purchaseReturns,
      AccountsWname.purchasesExpenses,
    ]);

    const inventoryAtTheEndOfThePeriod =
      await categoryService.getCategoryStatistics(
        null,
        CategoryWname.inventoryAtTheEndOfThePeriod
      );

    const otherRevenues = await categoryService.getCategoryStatistics(
      null,
      CategoryWname.otherRevenues
    );

    const activitySalesRevenue = await categoryService.getCategoryStatistics(
      null,
      CategoryWname.activitySalesRevenue
    );

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

    const AllotmentsAfter = sumGroupOfAccountsWithCustomPercentage(summaries, [
      {
        accountCode: AccountsWname.transportationDepreciationExpense,
        percentage: 10,
      },
      {
        accountCode: AccountsWname.hardwareSoftwareDepreciationExpense,
        percentage: 10,
      },
      {
        accountCode: AccountsWname.furnitureFurnishingsDepreciationExpense,
        percentage: 10,
      },
      {
        accountCode: AccountsWname.depreciationExpenseForMachineryEquipment,
        percentage: 10,
      },
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
      AllotmentsAfter,
      salesOutputTax,
      accountsObject,
    });
  } catch (error) {
    next(error);
  }
};

const statementOfFinancialPositionCrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const AccountsSummaries = await accountsService.statementFPositionSrvc();
    const CategorySummaries =
      await categoryService.getCategoryTransactionSummaryForCategories(
        FP_categories_codes
      );

    const accountsObject = AccountsSummaries.reduce((acc, account) => {
      if (account) {
        acc[account?.accountCode] = account;
      }
      return acc;
    }, {} as Record<string, Account>);

    const categoriesObject = CategorySummaries.reduce((cat, categroy) => {
      if (categroy) {
        cat[categroy?.categoryNumber] = categroy;
      }
      return cat;
    }, {} as any);

    const alkhusumAlthaabatuhTawiluhAlajil = sumFpAccounts([
      accountsObject[FP_accounts_names.althanadatTawiluhAlajil],
      accountsObject[FP_accounts_names.qurudTawiluhAlajil],
      accountsObject[FP_accounts_names.aldarayibAlmuajala],
    ]);

    const alasulAlthaabituhGhayrAlmalmusih = sumFpAccounts([
      accountsObject[FP_accounts_names.fame],
      accountsObject[FP_accounts_names.programs],
      accountsObject[FP_accounts_names.patent],
    ]);

    const propertyRights = sumFpAccounts([
      categoriesObject[FP_categories_names.capital],
      categoriesObject[FP_categories_names.jariAlshuraka],
      categoriesObject[FP_categories_names.alaribahAlmuhtajazuh],
      categoriesObject[FP_categories_names.alaihtiatat],
    ]);

    const alasulAlmutaduluh = sumFpAccounts([
      categoriesObject[FP_categories_names.clientsAbroad],
      categoriesObject[FP_categories_names.clientsInside],
      categoriesObject[FP_categories_names.inventory1],
      categoriesObject[FP_categories_names.inventory2],
      accountsObject[FP_accounts_names.hisabMadinatAkhari],
      accountsObject[FP_accounts_names.arrestPapers],
      accountsObject[FP_accounts_names.purchaseReturns],
      accountsObject[FP_accounts_names.purchases],
      accountsObject[FP_accounts_names.purchasesExpenses],
      categoriesObject[FP_categories_names.theBox],
      categoriesObject[FP_categories_names.theBanK],
      categoriesObject[FP_categories_names.ancestor],
      categoriesObject[FP_categories_names.covenant],
    ]);

    //
    const alkhusumAlmutadawiluh = sumFpAccounts([
      categoriesObject[FP_categories_names.alMothsatat],
      categoriesObject[FP_categories_names.almoredenInside],
      categoriesObject[FP_categories_names.almoredenOutside],
      accountsObject[FP_accounts_names.otherAccountsReceivable],
      accountsObject[FP_accounts_names.awraqAldafe],
      accountsObject[FP_accounts_names.ayradatMuqadamuh],
      accountsObject[FP_accounts_names.masrufatMustahiqih],
      accountsObject[FP_accounts_names.alqurudQasiruhAlajil],
      accountsObject[FP_accounts_names.daribuhAlmabieat],
    ]);

    // accountsObject[
    //   FP_accounts_names.buildingsAndRealEstate
    // ].totalBalance *= 0.98;

    // accountsObject[
    //   FP_accounts_names.furnitureAndFurnishings
    // ].totalBalance *= 0.85;

    // accountsObject[FP_accounts_names.machinesAndEquipment].totalBalance *= 0.85;

    // accountsObject[FP_accounts_names.cars].totalBalance *= 0.9;

    // accountsObject[FP_accounts_names.otherAssets].totalBalance *= 0.9;

    const alasulAlthaabituhAlmalmusah = sumFpAccounts([
      accountsObject[FP_accounts_names.lands],
      accountsObject[FP_accounts_names.buildingsAndRealEstate],
      accountsObject[FP_accounts_names.furnitureAndFurnishings],
      accountsObject[FP_accounts_names.machinesAndEquipment],
      accountsObject[FP_accounts_names.cars],
      accountsObject[FP_accounts_names.otherAssets],
    ]);

    res.json({
      alasulAlthaabituhAlmalmusah,
      alkhusumAlthaabatuhTawiluhAlajil: Math.abs(
        alkhusumAlthaabatuhTawiluhAlajil
      ),
      alasulAlthaabituhGhayrAlmalmusih,
      alasulAlmutaduluh,
      propertyRights: Math.abs(propertyRights),
      alkhusumAlmutadawiluh: Math.abs(alkhusumAlmutadawiluh),
      accountsObject,
      categoriesObject,
    });
  } catch (error) {
    next;
  }
};

export default {
  createAccountCtr,
  deleteAccountCtr,
  getAllAccountsCtr,
  getAccountById,
  getTransactionsSummaryForCategories,
  getTransForAccountsByNums,
  statementOfFinancialPositionCrl,
};
