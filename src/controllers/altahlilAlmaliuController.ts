import categoryService from "../services/categoryService";
import accountsService from "../services/accountsService";
import { NextFunction, Request, Response } from "express";
import { accounts, categories } from "../constants/accountsCodes";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();

    const alasulAlthaabatuh = await categoryService.getCategoryBalance(
      categories.alasulAlthaabatuh
    );

    const alasulAlthaabatuhTotal = await categoryService.getCategoryBalance(
      categories.alasulAlthaabatuh
    );

    const inventory2 = await categoryService.getCategoryBalance(
      categories.inventory2
    );

    const alasulAlmutadawiluh = await categoryService.getCategoryBalance(
      categories.alasulAlmutadawiluh
    );

    const alasulAlmutadawiluhTotla = await categoryService.getCategoryBalance(
      categories.alasulAlmutadawiluh
    );

    const alkhusumAlmutadawiluh = await categoryService.getCategoryBalance(
      categories.alkhusumAlmutadawiluh
    );

    const alkhusumAlthaabatuh = await categoryService.getCategoryBalance(
      categories.alkhusumAlthaabatuh
    );

    const alkhusum =
      alkhusumAlmutadawiluh.thisYearBalance +
      alkhusumAlthaabatuh.thisYearBalance;

    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );

    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );

    const theBanK = await categoryService.getCategoryBalance(
      categories.theBanK
    );

    const theBox = await categoryService.getCategoryBalance(categories.theBox);

    const masarifTashghilayh = await categoryService.getCategoryBalance(
      categories.masarifTashghilayh
    );

    const huquqAlmalakih = await categoryService.getCategoryBalance(
      categories.huquqAlmalakih
    );

    const masrufat_muqadamih = await categoryService.getCategoryBalance(
      categories.masrufat_muqadamih
    );

    const makhzun_akhir_alfatrih = await categoryService.getCategoryBalance(
      categories.inventoryAtTheEndOfThePeriod
    );

    const inventory1 = await categoryService.getCategoryBalance(
      categories.inventory1
    );

    const ayradat_akhari = await categoryService.getCategoryBalance(
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
    const safi_almushtariat = Math.abs(
      accountsObject[accounts.purchases].balance +
        accountsObject[accounts.purchasesExpenses].balance -
        accountsObject[accounts.purchaseReturns].balance -
        accountsObject[accounts.khasmuktasib].balance
    );

    // 3.
    const tukalifuh_almabieat = Math.abs(
      inventory2.previousYearsBalance +
        safi_almushtariat -
        inventory2.thisYearBalance
    );

    // 4.
    const alribh_altashghiliu = safi_almabieat - tukalifuh_almabieat;

    // 5.
    const safi_aldukhl = alribh_altashghiliu - masarifAdarih?.thisYearBalance;

    // 6.
    const altadafuq_alnaqdiu_min_alqurud =
      qurudQasiruhAlajil.thisYearBalance +
      qurudTawiluhAlajil.thisYearBalance -
      (qurudQasiruhAlajil.previousYearsBalance +
        qurudTawiluhAlajil.previousYearsBalance);

    // 7.
    const ras_almal_aleamil =
      alasulAlmutadawiluh?.thisYearBalance -
      inventory2.thisYearBalance -
      alkhusumAlmutadawiluh.thisYearBalance;

    const ras_almal_almustathmir =
      alasulAlthaabatuh?.thisYearBalance - ras_almal_aleamil;

    // 8.
    const ajamali_altamwil =
      alkhusumAlthaabatuh?.thisYearBalance + huquqAlmalakih?.thisYearBalance;

    // 9.
    const nasabuh_altadawul =
      (alasulAlmutadawiluh.thisYearBalance - inventory2.thisYearBalance) /
      alkhusumAlmutadawiluh.thisYearBalance;

    // 10.
    const nasabuh_altadawul_alsarie =
      (alasulAlmutadawiluh.thisYearBalance -
        inventory2.thisYearBalance -
        masrufat_muqadamih.thisYearBalance) /
      alkhusumAlmutadawiluh.thisYearBalance;

    // 11.
    const nasabuh_alnaqdih =
      (theBox.thisYearBalance +
        theBanK.thisYearBalance +
        accountsObject[accounts.arrestPapers].balance) /
      accountsObject[accounts.awraqAldafe].balance;

    // 13.
    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const hamish_mujmal_alribh = mujmal_alribh / safi_almabieat;

    // 14.
    const tukalifuh_albidaeuh_almubaeuh =
      accountsObject[accounts.sales].balance +
      accountsObject[accounts.salesReturns].balance +
      accountsObject[accounts.purchaseReturns].balance -
      makhzun_akhir_alfatrih.thisYearBalance;

    const alribh_altashghiliu_qabl_aldarayib =
      safi_almabieat -
      tukalifuh_albidaeuh_almubaeuh +
      ayradat_akhari.thisYearBalance -
      (masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance);

    const hamish_alribh_altashghilii = alribh_altashghiliu / safi_almabieat;

    // 15.
    const safi_alribh =
      alribh_altashghiliu_qabl_aldarayib -
      accountsObject[accounts.salesOutputTax].balance;

    const hamish_safi_alribh = safi_alribh / safi_almabieat;

    // 16.

    const alasulCurrent =
      alasulAlmutadawiluhTotla.thisYearBalance +
      alasulAlthaabatuh.thisYearBalance;

    const alasulPrev =
      alasulAlmutadawiluhTotla.previousYearsBalance +
      alasulAlthaabatuh.previousYearsBalance;

    const mutawasit_alasul = (alasulCurrent + alasulPrev) / 2;

    const mueadal_dawaran_alasul = safi_almabieat / mutawasit_alasul;

    // 17.
    const aleayid_eali_alasul = safi_alribh / mutawasit_alasul;

    // 18.
    const nasabah_almadiunih =
      (qurudQasiruhAlajil.thisYearBalance +
        qurudTawiluhAlajil.thisYearBalance) /
      (alasulAlmutadawiluh.thisYearBalance + alasulAlthaabatuh.thisYearBalance);

    // 19.
    const nasabah_almalkih =
      huquqAlmalakih.thisYearBalance /
      (alasulAlmutadawiluh.thisYearBalance + alasulAlthaabatuh.thisYearBalance);

    // 20.
    const mutawasit_alaistithmar = huquqAlmalakih.thisYearBalance / 2;

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

    // parseFloat(value.toFixed(3))
    res.json({
      safi_almabieat,
      safi_almushtariat,
      tukalifuh_almabieat,
      alribh_altashghiliu,
      safi_aldukhl,
      altadafuq_alnaqdiu_min_alqurud,
      ras_almal_almustathmir,
      ajamali_altamwil,
      nasabuh_altadawul: parseFloat(nasabuh_altadawul.toFixed(3)),
      nasabuh_altadawul_alsarie: parseFloat(
        nasabuh_altadawul_alsarie.toFixed(3)
      ),
      nasabuh_alnaqdih: parseFloat(nasabuh_alnaqdih.toFixed(3)),
      ras_almal_aleamil,
      hamish_mujmal_alribh: parseFloat(hamish_mujmal_alribh.toFixed(3)),
      hamish_alribh_altashghilii: parseFloat(
        hamish_alribh_altashghilii.toFixed(3)
      ),
      hamish_safi_alribh: parseFloat(hamish_safi_alribh.toFixed(3)),
      mueadal_dawaran_alasul: parseFloat(mueadal_dawaran_alasul.toFixed(3)),
      aleayid_eali_alasul: parseFloat(aleayid_eali_alasul.toFixed(3)),
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
