import categoryService from "../services/categoryService";
import accountsService from "../services/accountsService";
import { NextFunction, Request, Response } from "express";
import { accounts, categories } from "../constants/accountsCodes";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();

    const alasulAlthaabatuh = await categoryService.getSubcategoryBalances(
      categories.alasulAlthaabatuh
    );

    const alasulAlthaabatuhTotal =
      await categoryService.getSubcategoryBalancesTotal(
        categories.alasulAlthaabatuh
      );

    const alasulAlmutadawiluh = await categoryService.getSubcategoryBalances(
      categories.alasulAlmutadawiluh
    );

    const alasulAlmutadawiluhTotla =
      await categoryService.getSubcategoryBalancesTotal(
        categories.alasulAlmutadawiluh
      );

    const alkhusumAlmutadawiluh = await categoryService.getSubcategoryBalances(
      categories.alkhusumAlmutadawiluh
    );

    const alkhusumAlthaabatuh = await categoryService.getSubcategoryBalances(
      categories.alkhusumAlthaabatuh
    );

    const alkhusum =
      alkhusumAlmutadawiluh.balance + alkhusumAlthaabatuh.balance;

    const masarifAdarih = await categoryService.getSubcategoryBalances(
      categories.masarifAdarih
    );

    const masarifTaswiqayh = await categoryService.getSubcategoryBalances(
      categories.masarifTaswiqayh
    );

    const masarifTashghilayh = await categoryService.getSubcategoryBalances(
      categories.masarifTashghilayh
    );

    const huquqAlmalakih = await categoryService.getSubcategoryBalances(
      categories.huquqAlmalakih
    );

    const makhzun_akhir_alfatrih = await categoryService.getSubcategoryBalances(
      categories.inventoryAtTheEndOfThePeriod
    );

    const ayradat_akhari = await categoryService.getSubcategoryBalances(
      categories.otherRevenues
    );

    const qurudTawiluhAlajil = await accountsService.getAccountBalance(
      accounts.qurudTawiluhAlajil
    );

    const qurudQasiruhAlajil = await accountsService.getAccountBalance(
      accounts.alqurudQasiruhAlajil
    );

    // 1.
    const safi_almabieat =
      accountsObject[accounts.sales].balance -
      (accountsObject[accounts.allowedDiscount].balance -
        accountsObject[accounts.salesReturns].balance);
    // 2.
    const safi_almushtariat =
      accountsObject[accounts.purchases].balance +
      accountsObject[accounts.purchasesExpenses].balance -
      accountsObject[accounts.purchaseReturns].balance -
      accountsObject[accounts.khasmuktasib].balance;

    // 3.
    const tukalifuh_almabieat =
      safi_almushtariat - makhzun_akhir_alfatrih?.balance;

    // 4.
    const alribh_altashghiliu = safi_almabieat - tukalifuh_almabieat;

    // 5.
    const safi_aldukhl = alribh_altashghiliu - masarifAdarih?.balance;

    // 6.
    const altadafuq_alnaqdiu_min_alqurud =
      qurudQasiruhAlajil.thisYearBalance +
      qurudTawiluhAlajil.thisYearBalance -
      (qurudQasiruhAlajil.previousYearsBalance +
        qurudTawiluhAlajil.previousYearsBalance);

    // 7.
    const ras_almal_aleamil =
      alasulAlmutadawiluh?.balance - alkhusumAlmutadawiluh.balance;

    const ras_almal_almustathmir =
      alasulAlthaabatuh?.balance - ras_almal_aleamil;

    // 8.
    const ajamali_altamwil =
      alkhusumAlthaabatuh?.balance + huquqAlmalakih?.balance;

    // 9.
    const nasabuh_altadawul =
      alasulAlmutadawiluh.balance / alkhusumAlmutadawiluh.balance;

    // 10.
    const nasabuh_altadawul_alsarie =
      alasulAlmutadawiluh.balance / alkhusumAlmutadawiluh.balance;

    // 11.
    const nasabuh_alnaqdih = 404;

    // 13.
    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const hamish_mujmal_alribh = mujmal_alribh / safi_almabieat;

    // 14.
    const tukalifuh_albidaeuh_almubaeuh =
      accountsObject[accounts.sales].balance +
      accountsObject[accounts.salesReturns].balance +
      accountsObject[accounts.purchaseReturns].balance -
      makhzun_akhir_alfatrih.balance;

    const alribh_altashghiliu_qabl_aldarayib =
      safi_almabieat -
      tukalifuh_albidaeuh_almubaeuh +
      ayradat_akhari.balance -
      (masarifAdarih.balance + masarifTaswiqayh.balance);

    const hamish_alribh_altashghilii =
      alribh_altashghiliu_qabl_aldarayib / safi_almabieat;

    // 15.
    const safi_alribh =
      alribh_altashghiliu_qabl_aldarayib -
      accountsObject[accounts.salesOutputTax].balance;

    const hamish_safi_alribh = safi_alribh / safi_almabieat;

    // 16.
    const mutawasit_alasul =
      alasulAlmutadawiluhTotla.balance / alasulAlthaabatuhTotal.balance / 2;

    const mueadal_dawaran_alasul = safi_almabieat / mutawasit_alasul;

    // 17.
    const aleayid_eali_alasul = safi_alribh / mutawasit_alasul;

    // 18.
    const nasabah_almadiunih =
      (qurudQasiruhAlajil.thisYearBalance +
        qurudTawiluhAlajil.thisYearBalance) /
      (alasulAlmutadawiluh.balance + alasulAlthaabatuh.balance);

    // 19.
    const nasabah_almalkih =
      huquqAlmalakih.balance /
      (alasulAlmutadawiluh.balance + alasulAlthaabatuh.balance);

    // 20.
    const mutawasit_alaistithmar = huquqAlmalakih.balance / 2;

    // 21.
    const mueadal_aleayid_almuhasabii = 404;

    // 22.
    const almuazinuh_alnaqdayh = 404;

    // 23.
    const mueadal_dawaran_almadinin = 404;

    // 24.
    const mutawasit_almadinin = 404;

    // 25.
    const mutawasit_fatrih_altahsil = 404;

    res.json({
      safi_almabieat,
      safi_almushtariat,
      tukalifuh_almabieat,
      alribh_altashghiliu,
      safi_aldukhl,
      altadafuq_alnaqdiu_min_alqurud,
      ras_almal_almustathmir,
      ajamali_altamwil,
      nasabuh_altadawul,
      nasabuh_alnaqdih,
      ras_almal_aleamil,
      nasabuh_altadawul_alsarie,
      hamish_mujmal_alribh,
      hamish_alribh_altashghilii,
      hamish_safi_alribh,
      mueadal_dawaran_alasul,
      aleayid_eali_alasul,
      nasabah_almadiunih,
      nasabah_almalkih,
      mutawasit_alaistithmar,
      mueadal_aleayid_almuhasabii,
      almuazinuh_alnaqdayh,
      mueadal_dawaran_almadinin,
      mutawasit_almadinin,
      mutawasit_fatrih_altahsil,
    });
  } catch (error) {
    next(error);
  }
};
