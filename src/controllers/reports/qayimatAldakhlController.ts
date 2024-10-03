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

    const salesOutputTax =
      accountsObject[accounts.salesOutputTax]?.balance || 0;

    const totalGeneralAdministrativeAndOperatingExpenses =
      masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance;

    const totalSellingAndDistributionExpenses =
      masarifTaswiqayh.thisYearBalance;

    const safi_almabieat = Math.abs(
      (accountsObject[accounts.sales]?.balance || 0) -
        ((accountsObject[accounts.allowedDiscount]?.balance || 0) -
          (accountsObject[accounts.salesReturns]?.balance || 0))
    );

    const purchasesReturnedExpenses =
      (accountsObject[accounts.purchases]?.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.balance || 0);
    accountsObject[accounts.purchasesExpenses]?.balance || 0;

    const costOfGoodsSold =
      purchasesReturnedExpenses -
      (inventoryAtTheEndOfThePeriod?.thisYearBalance || 0);

    const totalIncome = safi_almabieat - costOfGoodsSold;

    const variousTotalRevenues =
      safi_almabieat - costOfGoodsSold + (otherRevenues?.thisYearBalance || 0);

    const safi_almushtariat = Math.abs(
      (accountsObject[accounts.purchases]?.balance || 0) +
        (accountsObject[accounts.purchasesExpenses]?.balance || 0) -
        (accountsObject[accounts.purchaseReturns]?.balance || 0) -
        (accountsObject[accounts.khasmuktasib]?.balance || 0)
    );

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
      accountsObject[accounts.daribuhAldukhl]?.balance || 0;

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
      netProfitOrLossBeforeTaxes - salesOutputTax;

    res.json({
      almukhasasat,
      safi_almabieat,
      tukalifuh_almabieat,
      mujmal_alribh,
      alribh_qabl_aldarayib,
      safi_alribh,
      ajamali_ayradat_mukhtalifuh,
      NetSales: safi_almabieat,
      purchasesReturnedExpenses,
      inventoryAtTheEndOfThePeriod,
      otherRevenues,
      activitySalesRevenue,
      totalSellingAndDistributionExpenses,
      totalGeneralAdministrativeAndOperatingExpenses,
      AllotmentsAfter: almukhasasat,
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

export default qayimat_aldakhlController;
