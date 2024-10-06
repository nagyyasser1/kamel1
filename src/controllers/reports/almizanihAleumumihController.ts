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

    /**#########################################################
     * to get "alribh_baed_aldarayib".
     * #########################################################
     */

    const makhzun_akhir_alfatrih = await categoryService.getCategoryBalance(
      categories.inventoryAtTheEndOfThePeriod
    );
    const ayradat_akhari = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );
    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );
    const masarifTashghilayh = await categoryService.getCategoryBalance(
      categories.masarifTashghilayh
    );
    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );
    const almukhasasat = await categoryService.getCategoryBalance(
      categories.alMothsatat
    );
    const daribuh_aldukhl =
      accountsObject[accounts.daribuhAldukhl]?.currentYear.balance || 0;

    /** Page ( 1 )*/

    // 1.
    const safi_almabieat =
      (accountsObject[accounts.sales]?.currentYear.balance || 0) -
      Math.abs(
        (accountsObject[accounts.allowedDiscount]?.currentYear.balance || 0) +
          (accountsObject[accounts.salesReturns]?.currentYear.balance || 0)
      );

    // 2.
    const purchasesReturnedExpenses =
      (accountsObject[accounts.purchases]?.currentYear.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.currentYear.balance || 0) +
      (accountsObject[accounts.purchasesExpenses]?.currentYear.balance || 0);

    const tukalifuh_albidaeuh_almubaeuh =
      purchasesReturnedExpenses +
      (makhzun_akhir_alfatrih?.thisYearBalance || 0);

    // 4.
    const mujmal_alribh =
      safi_almabieat - Math.abs(tukalifuh_albidaeuh_almubaeuh);

    // 5.
    const ajamali_ayradat_mukhtalifuh =
      mujmal_alribh + (ayradat_akhari?.thisYearBalance || 0);

    /** Page ( 2 ) */
    // 6.
    const ajamaliu_almasarif_4 =
      masarifAdarih.thisYearBalance +
      masarifTaswiqayh.thisYearBalance +
      almukhasasat.thisYearBalance +
      masarifTashghilayh.thisYearBalance;

    // 7.
    const alribh_qabl_aldarayib =
      ajamali_ayradat_mukhtalifuh - Math.abs(ajamaliu_almasarif_4);

    // 8.
    const alribh_baed_aldarayib =
      alribh_qabl_aldarayib - Math.abs(daribuh_aldukhl);

    /**#########################################################
     *  to get "almizanihAleumumih"
     * #########################################################
     */
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

    const alkhusumAlthaabatuh = await categoryService.getCategoryBalance(
      categories.alkhusumAlthaabatuh
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

    const ajamali_alasul_althaabitih =
      alasulAlthaabituhAlmalmusah.thisYearBalance +
      alasulAlthaabituhGhayrAlmalmusih.thisYearBalance;

    const ajamaliu_aliailtizamat_tawiluh_alajil =
      alkhusumAlthaabatuh.thisYearBalance + propertyRights.thisYearBalance;

    const alasulFinal =
      alasulAlmutaduluh.thisYearBalance +
      alasulAlthaabituhAlmalmusah.thisYearBalance +
      alasulAlthaabituhGhayrAlmalmusih.thisYearBalance -
      Math.abs(
        inventory2.thisYearBalance + (purchases.currentYear?.balance || 0)
      );

    const alkhusumFinal =
      alkhusumAlmutadawiluh.thisYearBalance +
      alkhusumAlthaabatuh.thisYearBalance +
      propertyRights.thisYearBalance +
      alribh_baed_aldarayib;

    res.json({
      alasulAlmutaduluh: alasulAlmutaduluh.thisYearBalance,
      alasulAlthaabituhAlmalmusah: alasulAlthaabituhAlmalmusah.thisYearBalance,
      alasulAlthaabituhGhayrAlmalmusih:
        alasulAlthaabituhGhayrAlmalmusih.thisYearBalance,
      alasulFinal,
      alkhusumFinal,
      inventory2,
      purchases,
      sales,
      alMothsatat,
      alayaradat,
      ajamaliu_aliailtizamat_tawiluh_alajil,
      huquqAlmalakih: huquqAlmalakih.thisYearBalance,
      almasrufat,
      safi_alribh: mujmal_alribh,
      inventory1,
      propertyRights: propertyRights.thisYearBalance,
      ajamali_alasul_althaabitih,
      alkhusumAlthaabatuhTawiluhAlajil: alkhusumAlthaabatuh.thisYearBalance,
      alkhusumAlmutadawiluh: alkhusumAlmutadawiluh.thisYearBalance,
      netProfitOrLossBeforeTaxes: alribh_qabl_aldarayib,
      netProfitOrLossAfterDeductingTaxes: alribh_baed_aldarayib,
      accountsObject,
      categoriesObject,
    });
  } catch (error) {
    next(error);
  }
};

export default almizanihAleumumihController;
