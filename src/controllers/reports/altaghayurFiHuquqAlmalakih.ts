import accountsService from "../../services/accountsService";
import { accounts, categories } from "../../constants/accountsCodes";
import categoryService from "../../services/categoryService";
import { NextFunction, Request, Response } from "express";

const altaghayurFiHuquqAlmalakih = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();

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

    const ras_almal = await categoryService.getCategoryBalance(
      categories.ras_almal
    );

    const mashubat_shakhsayh = 404;

    const ras_almal_fi_nihayih_alfatrah =
      ras_almal.previousYearsBalance +
      ras_almal.thisYearBalance +
      alribh_baed_aldarayib -
      mashubat_shakhsayh;

    const { category, ...ras_almal_without_category } = ras_almal;

    res.json({
      ras_almal: ras_almal_without_category,
      safi_alribh: alribh_baed_aldarayib,
      mashubat_shakhsayh,
      ras_almal_fi_nihayih_alfatrah,
    });
  } catch (error) {
    next(error);
  }
};

export default altaghayurFiHuquqAlmalakih;
