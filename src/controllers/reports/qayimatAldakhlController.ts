import categoryService from "../../services/categoryService";
import { accounts, categories } from "../../constants/accountsCodes";
import accountsService from "../../services/accountsService";
import { NextFunction, Request, Response } from "express";

const qayimat_aldakhlController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();
    const inventoryAtTheEndOfThePeriod =
      await categoryService.getCategoryBalance(
        categories.inventoryAtTheEndOfThePeriod
      );

    const otherRevenues = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );

    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );

    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );

    const activitySalesRevenue = await categoryService.getCategoryBalance(
      categories.activitySalesRevenue
    );

    const almukhasasat = await categoryService.getCategoryBalance(
      categories.alMothsatat
    );

    const daribuhAldukhl =
      accountsObject[accounts.daribuhAldukhl]?.currentYear.balance || 0;

    const totalGeneralAdministrativeAndOperatingExpenses =
      masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance;

    const totalSellingAndDistributionExpenses =
      masarifTaswiqayh.thisYearBalance;

    const safi_almabieat =
      (accountsObject[accounts.sales]?.currentYear.balance || 0) -
      ((accountsObject[accounts.allowedDiscount]?.currentYear.balance || 0) +
        (accountsObject[accounts.salesReturns]?.currentYear.balance || 0));

    const purchasesReturnedExpenses =
      (accountsObject[accounts.purchases]?.currentYear.balance || 0) +
        (accountsObject[accounts.purchaseReturns]?.currentYear.balance || 0) +
        accountsObject[accounts.purchasesExpenses]?.currentYear.balance || 0;

    const costOfGoodsSold =
      purchasesReturnedExpenses -
      (inventoryAtTheEndOfThePeriod?.thisYearBalance || 0);

    const totalIncome = safi_almabieat - costOfGoodsSold;

    const variousTotalRevenues =
      safi_almabieat - costOfGoodsSold + (otherRevenues?.thisYearBalance || 0);

    const safi_almushtariat =
      (accountsObject[accounts.purchases]?.currentYear?.balance || 0) +
      (accountsObject[accounts.purchasesExpenses]?.currentYear?.balance || 0) -
      (accountsObject[accounts.purchaseReturns]?.currentYear?.balance || 0) -
      (accountsObject[accounts.khasmuktasib]?.currentYear?.balance || 0);

    const tukalifuh_almabieat =
      safi_almushtariat + (inventoryAtTheEndOfThePeriod?.thisYearBalance || 0);

    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const alribh_qabl_aldarayib =
      mujmal_alribh +
      (otherRevenues?.thisYearBalance || 0) -
      (totalSellingAndDistributionExpenses +
        totalGeneralAdministrativeAndOperatingExpenses +
        almukhasasat.thisYearBalance);

    const daribuh_aldukhl =
      accountsObject[accounts.daribuhAldukhl]?.currentYear.balance || 0;

    const safi_alribh = alribh_qabl_aldarayib - daribuh_aldukhl; //

    const ajamali_ayradat_mukhtalifuh =
      mujmal_alribh + (otherRevenues?.thisYearBalance || 0);

    const netProfitOrLossBeforeTaxes =
      safi_almabieat -
      costOfGoodsSold +
      (otherRevenues?.thisYearBalance || 0) -
      (totalSellingAndDistributionExpenses -
        totalGeneralAdministrativeAndOperatingExpenses);

    const netProfitOrLossAfterDeductingTaxes =
      netProfitOrLossBeforeTaxes - daribuhAldukhl;

    res.json({
      almukhasasat: almukhasasat.thisYearBalance,
      safi_almabieat,
      tukalifuh_almabieat,
      mujmal_alribh,
      alribh_qabl_aldarayib,
      safi_alribh,
      ajamali_ayradat_mukhtalifuh,
      NetSales: safi_almabieat,
      purchasesReturnedExpenses,
      inventoryAtTheEndOfThePeriod:
        inventoryAtTheEndOfThePeriod.thisYearBalance,
      otherRevenues: otherRevenues.thisYearBalance,
      activitySalesRevenue: activitySalesRevenue.thisYearBalance,
      totalSellingAndDistributionExpenses,
      totalGeneralAdministrativeAndOperatingExpenses,
      AllotmentsAfter: almukhasasat.thisYearBalance,
      costOfGoodsSold,
      totalIncome,
      variousTotalRevenues,
      netProfitOrLossBeforeTaxes,
      netProfitOrLossAfterDeductingTaxes,
      salesOutputTax: daribuhAldukhl,
      accountsObject,
    });
  } catch (error) {
    next(error);
  }
};

export default qayimat_aldakhlController;
