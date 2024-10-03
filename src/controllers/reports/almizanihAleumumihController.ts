import categoryService from "../../services/categoryService";
import accountsService from "../../services/accountsService";
import { NextFunction, Request, Response } from "express";
import { accounts, categories } from "../../constants/accountsCodes";

const almizanihAleumumihController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();
    const CategorySummaries =
      await categoryService.getCategoryTransactionSummaryForAllCategories();

    const categoriesObject = CategorySummaries.reduce((cat, categroy) => {
      if (categroy) {
        cat[categroy?.categoryNumber] = categroy;
      }
      return cat;
    }, {} as any);

    const alkhusumAlmutadawiluh = await categoryService.getCategoryBalance(
      categories.alkhusumAlmutadawiluh
    );

    const alkhusumAlthaabatuh = await categoryService.getCategoryBalance(
      categories.alkhusumAlthaabatuh
    );

    const alasulAlthaabituhGhayrAlmalmusih =
      await categoryService.getCategoryBalance(
        categories.alasulAlthaabituhGhayrAlmalmusih
      );

    const propertyRights = await categoryService.getCategoryBalance(
      categories.huquqAlmalakih
    );

    const alasulAlmutaduluh = await categoryService.getCategoryBalance(
      categories.alasulAlmutadawiluh
    );

    const alasulAlthaabituhAlmalmusah =
      await categoryService.getCategoryBalance(
        categories.alasulAlthaabituhAlmalmusah
      );

    const almukhasasat = await categoryService.getCategoryBalance(
      categories.alMothsatat
    );

    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );

    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );

    const safi_almabieat = Math.abs(
      (accountsObject[accounts.sales]?.balance || 0) -
        ((accountsObject[accounts.allowedDiscount]?.balance || 0) -
          (accountsObject[accounts.salesReturns]?.balance || 0))
    );

    const purchasesReturnedExpenses =
      (accountsObject[accounts.purchases]?.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.balance || 0);
    accountsObject[accounts.purchasesExpenses]?.balance || 0;

    const inventoryAtTheEndOfThePeriod =
      await categoryService.getCategoryBalance(
        categories.inventoryAtTheEndOfThePeriod
      );

    const otherRevenues = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );

    const totalSellingAndDistributionExpenses =
      masarifTaswiqayh.thisYearBalance;

    const totalGeneralAdministrativeAndOperatingExpenses =
      masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance;

    const salesOutputTax =
      accountsObject[accounts.salesOutputTax]?.balance || 0;

    const costOfGoodsSold =
      purchasesReturnedExpenses -
      (inventoryAtTheEndOfThePeriod?.thisYearBalance || 0);

    const netProfitOrLossBeforeTaxes =
      safi_almabieat -
      costOfGoodsSold +
      (otherRevenues?.thisYearBalance || 0) -
      (totalSellingAndDistributionExpenses -
        totalGeneralAdministrativeAndOperatingExpenses);

    const netProfitOrLossAfterDeductingTaxes =
      netProfitOrLossBeforeTaxes - salesOutputTax;

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

    const safi_alribh = alribh_qabl_aldarayib - daribuh_aldukhl;

    res.json({
      safi_alribh,
      alasulAlmutaduluh,
      propertyRights,
      alasulAlthaabituhAlmalmusah,
      alasulAlthaabituhGhayrAlmalmusih,
      alkhusumAlthaabatuhTawiluhAlajil: alkhusumAlthaabatuh,
      alkhusumAlmutadawiluh,
      netProfitOrLossBeforeTaxes,
      netProfitOrLossAfterDeductingTaxes,
      accountsObject,
      categoriesObject,
    });
  } catch (error) {
    next(error);
  }
};

export default almizanihAleumumihController;
