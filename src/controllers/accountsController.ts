import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../constants/statusCodes";
import * as accountsService from "../services/accountsService";
import CustomError from "../utils/CustomError";
import entryExists from "../utils/entryExists.util";
import { EntryType } from "../utils/enums";
import sumGroupOfAccounts from "../utils/sumGroupOfAccounts";
import ACCOUNTS_CODES_FOR_INCOME, {
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
import transactionsService from "../services/transactionsService";

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

// قائمه الدخل
const getTransForAccountsByNums = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const summaries =
      await accountsService.getTransactionsSummaryForArrayOfAccountsNumber(
        ACCOUNTS_CODES_FOR_INCOME
      );

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

    const AllotmentsAfter = sumGroupOfAccounts(summaries, [
      AccountsWname.transportationDepreciationExpense,
      AccountsWname.hardwareSoftwareDepreciationExpense,
      AccountsWname.furnitureFurnishingsDepreciationExpense,
      AccountsWname.depreciationExpenseForMachineryEquipment,
    ]);

    // const AllotmentsAfter = sumGroupOfAccountsWithCustomPercentage(summaries, [
    //   {
    //     accountCode: AccountsWname.transportationDepreciationExpense,
    //     percentage: 10,
    //   },
    //   {
    //     accountCode: AccountsWname.hardwareSoftwareDepreciationExpense,
    //     percentage: 10,
    //   },
    //   {
    //     accountCode: AccountsWname.furnitureFurnishingsDepreciationExpense,
    //     percentage: 10,
    //   },
    //   {
    //     accountCode: AccountsWname.depreciationExpenseForMachineryEquipment,
    //     percentage: 10,
    //   },
    // ]);

    const salesOutputTax = sumGroupOfAccounts(summaries, [
      AccountsWname.salesOutputTax,
    ]);

    const accountsObject = summaries.reduce((acc, account) => {
      if (account) {
        acc[account?.accountCode] = account;
      }
      return acc;
    }, {} as Record<string, Account>);

    // updates
    const costOfGoodsSold =
      purchasesReturnedExpenses -
      (inventoryAtTheEndOfThePeriod?.totalBalance || 0);

    const totalIncome = NetSales - costOfGoodsSold;

    const netProfitOrLossBeforeTaxes =
      NetSales -
      costOfGoodsSold +
      (otherRevenues?.totalBalance || 0) -
      (totalSellingAndDistributionExpenses -
        totalGeneralAdministrativeAndOperatingExpenses);

    const variousTotalRevenues =
      NetSales - costOfGoodsSold + (otherRevenues?.totalBalance || 0);

    const netProfitOrLossAfterDeductingTaxes =
      netProfitOrLossBeforeTaxes - salesOutputTax;

    // new
    const almukhasasat = sumGroupOfAccounts(summaries, [
      AccountsWname.transportationDepreciationExpense,
      AccountsWname.hardwareSoftwareDepreciationExpense,
      AccountsWname.furnitureFurnishingsDepreciationExpense,
      AccountsWname.depreciationExpenseForMachineryEquipment,
    ]);

    const safi_almabieat =
      sumGroupOfAccounts(summaries, [AccountsWname.sales]) -
      Math.abs(
        sumGroupOfAccounts(summaries, [
          AccountsWname.allowedDiscount,
          AccountsWname.salesReturns,
        ])
      );

    const safi_almushtariat = sumGroupOfAccounts(summaries, [
      AccountsWname.purchases,
      AccountsWname.purchaseReturns,
      AccountsWname.purchasesExpenses,
    ]);

    const tukalifuh_almabieat =
      safi_almushtariat + (inventoryAtTheEndOfThePeriod?.totalBalance || 0);

    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const alribh_qabl_aldarayib =
      mujmal_alribh +
      (otherRevenues?.totalBalance || 0) -
      (totalSellingAndDistributionExpenses +
        totalGeneralAdministrativeAndOperatingExpenses +
        almukhasasat);

    const daribuh_aldukhl = sumGroupOfAccounts(summaries, [
      AccountsWname.daribuhAldukhl,
    ]);

    const safi_alribh = alribh_qabl_aldarayib - daribuh_aldukhl; //

    const ajamali_ayradat_mukhtalifuh =
      mujmal_alribh + (otherRevenues?.totalBalance || 0);

    res.json({
      almukhasasat,
      safi_almabieat,
      tukalifuh_almabieat,
      mujmal_alribh,
      alribh_qabl_aldarayib,
      safi_alribh,
      ajamali_ayradat_mukhtalifuh,
      NetSales,
      purchasesReturnedExpenses,
      inventoryAtTheEndOfThePeriod,
      otherRevenues,
      activitySalesRevenue,
      totalSellingAndDistributionExpenses,
      totalGeneralAdministrativeAndOperatingExpenses,
      AllotmentsAfter,
      costOfGoodsSold,
      totalIncome,
      variousTotalRevenues,
      netProfitOrLossBeforeTaxes,
      netProfitOrLossAfterDeductingTaxes,
      salesOutputTax,
      accountsObject,
    });
  } catch (error) {
    next(error);
  }
};

// الميزانيه العموميه
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
      categoriesObject[FP_categories_names.inventory2],
      accountsObject[FP_accounts_names.hisabMadinatAkhari],
      accountsObject[FP_accounts_names.arrestPapers],
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

    const alasulAlthaabituhAlmalmusah = sumFpAccounts([
      accountsObject[FP_accounts_names.lands],
      accountsObject[FP_accounts_names.buildingsAndRealEstate],
      accountsObject[FP_accounts_names.furnitureAndFurnishings],
      accountsObject[FP_accounts_names.machinesAndEquipment],
      accountsObject[FP_accounts_names.cars],
      accountsObject[FP_accounts_names.otherAssets],
    ]);

    // update

    const summaries =
      await accountsService.getTransactionsSummaryForArrayOfAccountsNumber(
        ACCOUNTS_CODES_FOR_INCOME
      );

    const netSales =
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

    const activitySalesRevenue = await categoryService.getCategoryStatistics(
      null,
      CategoryWname.activitySalesRevenue
    );

    const otherRevenues = await categoryService.getCategoryStatistics(
      null,
      CategoryWname.otherRevenues
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

    const salesOutputTax = sumGroupOfAccounts(summaries, [
      AccountsWname.salesOutputTax,
    ]);

    const costOfGoodsSold =
      purchasesReturnedExpenses -
      (inventoryAtTheEndOfThePeriod?.totalBalance || 0);

    const netProfitOrLossBeforeTaxes =
      netSales -
      costOfGoodsSold +
      (otherRevenues?.totalBalance || 0) -
      (totalSellingAndDistributionExpenses -
        totalGeneralAdministrativeAndOperatingExpenses);

    const netProfitOrLossAfterDeductingTaxes =
      netProfitOrLossBeforeTaxes - salesOutputTax;

    const safi_almushtariat = sumGroupOfAccounts(summaries, [
      AccountsWname.purchases,
      AccountsWname.purchaseReturns,
      AccountsWname.purchasesExpenses,
    ]);

    const tukalifuh_almabieat =
      safi_almushtariat + (inventoryAtTheEndOfThePeriod?.totalBalance || 0);

    const safi_almabieat =
      sumGroupOfAccounts(summaries, [AccountsWname.sales]) -
      Math.abs(
        sumGroupOfAccounts(summaries, [
          AccountsWname.allowedDiscount,
          AccountsWname.salesReturns,
        ])
      );

    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const almukhasasat = sumGroupOfAccounts(summaries, [
      AccountsWname.transportationDepreciationExpense,
      AccountsWname.hardwareSoftwareDepreciationExpense,
      AccountsWname.furnitureFurnishingsDepreciationExpense,
      AccountsWname.depreciationExpenseForMachineryEquipment,
    ]);

    const alribh_qabl_aldarayib =
      mujmal_alribh +
      (otherRevenues?.totalBalance || 0) -
      (totalSellingAndDistributionExpenses +
        totalGeneralAdministrativeAndOperatingExpenses +
        almukhasasat);

    const daribuh_aldukhl = sumGroupOfAccounts(summaries, [
      AccountsWname.daribuhAldukhl,
    ]);

    const safi_alribh = alribh_qabl_aldarayib - daribuh_aldukhl;

    res.json({
      safi_alribh,
      alasulAlmutaduluh,
      propertyRights,
      alasulAlthaabituhAlmalmusah,
      alasulAlthaabituhGhayrAlmalmusih,
      alkhusumAlthaabatuhTawiluhAlajil,
      alkhusumAlmutadawiluh,
      netProfitOrLossBeforeTaxes,
      netProfitOrLossAfterDeductingTaxes,
      accountsObject,
      categoriesObject,
    });
  } catch (error) {
    next;
  }
};

// التحليل المالي
const altahlil_almaliu_ctl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  statementOfFinancialPositionCrl,
  altahlil_almaliu_ctl,
};
