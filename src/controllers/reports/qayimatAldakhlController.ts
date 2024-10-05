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
    /**  */
    const { accountsObject } = await accountsService.getAccountsBalances();

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
      ((accountsObject[accounts.allowedDiscount]?.currentYear.balance || 0) +
        (accountsObject[accounts.salesReturns]?.currentYear.balance || 0));

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
    const alribh_baed_aldarayib = alribh_qabl_aldarayib - daribuh_aldukhl;

    // res.json({
    //   safi_almabieat,
    //   purchasesReturnedExpenses,
    //   tukalifuh_albidaeuh_almubaeuh,
    //   mujmal_alribh,
    //   ajamali_ayradat_mukhtalifuh,
    //   ajamaliu_almasarif_4,
    //   alribh_qabl_aldarayib,
    //   alribh_baed_aldarayib,
    //   details: {
    //     makhzun_akhir_alfatrih: makhzun_akhir_alfatrih.thisYearBalance,
    //     ayradat_akhari: ayradat_akhari.thisYearBalance,
    //     masarifTaswiqayh: masarifTaswiqayh.thisYearBalance,
    //     masarifAdarih: masarifAdarih.thisYearBalance,
    //     masarifTashghilayh: masarifTashghilayh.thisYearBalance,
    //     almukhasasat: almukhasasat.thisYearBalance,
    //     daribuh_aldukhl: daribuh_aldukhl,
    //   },
    // });
    res.json({
      almukhasasat: almukhasasat.thisYearBalance,
      masarifAdarih: masarifAdarih.thisYearBalance,
      masarifTaswiqayh: masarifTaswiqayh.thisYearBalance,
      safi_almabieat,
      // tukalifuh_almabieat,
      mujmal_alribh,
      alribh_qabl_aldarayib,
      safi_alribh: alribh_baed_aldarayib,
      ajamali_ayradat_mukhtalifuh,
      NetSales: safi_almabieat,
      purchasesReturnedExpenses,
      inventoryAtTheEndOfThePeriod: makhzun_akhir_alfatrih.thisYearBalance,
      otherRevenues: ayradat_akhari.thisYearBalance,
      // activitySalesRevenue: activitySalesRevenue.thisYearBalance,
      totalSellingAndDistributionExpenses: masarifTaswiqayh.thisYearBalance,
      totalGeneralAdministrativeAndOperatingExpenses:
        masarifAdarih.thisYearBalance,
      AllotmentsAfter: almukhasasat.thisYearBalance,
      costOfGoodsSold: tukalifuh_albidaeuh_almubaeuh,
      totalIncome: mujmal_alribh,
      variousTotalRevenues: ajamali_ayradat_mukhtalifuh,
      netProfitOrLossBeforeTaxes: alribh_qabl_aldarayib,
      netProfitOrLossAfterDeductingTaxes: alribh_baed_aldarayib,
      salesOutputTax: daribuh_aldukhl,
      accountsObject,
    });
  } catch (error) {
    next(error);
  }
};

export default qayimat_aldakhlController;
