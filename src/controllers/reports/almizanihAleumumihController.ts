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

    const alasul = await categoryService.getCategoryBalance(categories.alasul);
    const alkhusum = await categoryService.getCategoryBalance(
      categories.alkhusum
    );
    const huquqAlmalakih = await categoryService.getCategoryBalance(
      categories.huquqAlmalakih
    );
    const alayaradat = await categoryService.getCategoryBalance(
      categories.alayaradat
    );
    const almasrufat = await categoryService.getCategoryBalance(
      categories.almasrufat
    );

    const alkhusumAlmutadawiluh = await categoryService.getCategoryBalance(
      categories.alkhusumAlmutadawiluh
    );

    const inventory1 = await categoryService.getCategoryBalance(
      categories.inventory1
    );

    const inventory2 = await categoryService.getCategoryBalance(
      categories.inventory2
    );

    const alMothsatat = await categoryService.getCategoryBalance(
      categories.alMothsatat
    );

    const purchases = await accountsService.getAccountBalance(
      accounts.purchases
    );

    const sales = await accountsService.getAccountBalance(accounts.sales);

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

    const safi_almabieat =
      (accountsObject[accounts.sales]?.currentYear?.balance || 0) -
      ((accountsObject[accounts.allowedDiscount]?.currentYear?.balance || 0) -
        (accountsObject[accounts.salesReturns]?.currentYear?.balance || 0));

    const purchasesReturnedExpenses =
      (accountsObject[accounts.purchases]?.currentYear?.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.currentYear?.balance || 0);
    accountsObject[accounts.purchasesExpenses]?.currentYear?.balance || 0;

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
      masarifAdarih.thisYearBalance;

    const daribuhAlmabieat =
      accountsObject[accounts.daribuhAlmabieat]?.currentYear?.balance || 0;

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
      netProfitOrLossBeforeTaxes - daribuhAlmabieat;

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
      accountsObject[accounts.daribuhAldukhl]?.currentYear?.balance || 0;

    const safi_alribh = alribh_qabl_aldarayib - daribuh_aldukhl;

    const alasulFinal =
      alasul.thisYearBalance -
      (inventory2.thisYearBalance + (purchases.currentYear?.balance || 0));

    const alkhusumFinal =
      alkhusum.thisYearBalance -
      (sales.currentYear.balance, alMothsatat.thisYearBalance);

    res.json({
      alasulFinal,
      alkhusumFinal,
      inventory2,
      purchases,
      sales,
      alMothsatat,
      alasul,
      alkhusum,
      alayaradat,
      huquqAlmalakih,
      almasrufat,
      safi_alribh,
      inventory1,
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
