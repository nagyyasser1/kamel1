import categoryService from "../../services/categoryService";
import accountsService from "../../services/accountsService";
import { NextFunction, Request, Response } from "express";
import { accounts, categories } from "../../constants/accountsCodes";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountsObject } = await accountsService.getAccountsBalances();

    const alasulAlthaabatuh = await categoryService.getCategoryBalance(
      categories.alasulAlthaabatuh
    );

    const inventory2 = await categoryService.getCategoryBalance(
      categories.inventory2
    );

    const alasulAlmutadawiluh = await categoryService.getCategoryBalance(
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

    const ras_almal = await categoryService.getCategoryBalance(
      categories.ras_almal
    );

    const inventory1 = await categoryService.getCategoryBalance(
      categories.inventory1
    );

    const ayradat_akhari = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );

    const clients = await categoryService.getCategoryBalance(
      categories.clients
    );

    const qurudTawiluhAlajil: any = await accountsService.getAccountBalance(
      accounts.qurudTawiluhAlajil
    );

    const qurudQasiruhAlajil: any = await accountsService.getAccountBalance(
      accounts.alqurudQasiruhAlajil
    );

    // 1.
    const safi_almabieat =
      (accountsObject[accounts.sales]?.currentYear.balance || 0) -
      ((accountsObject[accounts.allowedDiscount]?.currentYear.balance || 0) -
        (accountsObject[accounts.salesReturns]?.currentYear.balance || 0));
    // 2.
    const safi_almushtariat =
      (accountsObject[accounts.purchases]?.currentYear.balance || 0) +
      (accountsObject[accounts.purchasesExpenses]?.currentYear.balance || 0) -
      (accountsObject[accounts.purchaseReturns]?.currentYear.balance || 0) -
      (accountsObject[accounts.khasmuktasib]?.currentYear.balance || 0);
    // 3.
    const tukalifuh_almabieat =
      inventory2?.previousYearsBalance +
      safi_almushtariat -
      inventory2?.thisYearBalance;
    // 4.
    const alribh_altashghiliu = safi_almabieat - tukalifuh_almabieat;

    // 5.
    const safi_aldukhl = alribh_altashghiliu - masarifAdarih?.thisYearBalance;

    // 6.
    const altadafuq_alnaqdiu_min_alqurud =
      qurudQasiruhAlajil?.thisYearBalance +
      qurudTawiluhAlajil?.thisYearBalance -
      (qurudQasiruhAlajil?.previousYearsBalance +
        qurudTawiluhAlajil?.previousYearsBalance);

    // 7.
    const ras_almal_aleamil =
      alasulAlmutadawiluh?.thisYearBalance -
      inventory2?.thisYearBalance -
      alkhusumAlmutadawiluh?.thisYearBalance;

    const ras_almal_almustathmir =
      alasulAlthaabatuh?.thisYearBalance - ras_almal_aleamil;

    // 8.
    const ajamali_altamwil =
      alkhusumAlthaabatuh?.thisYearBalance + huquqAlmalakih?.thisYearBalance;

    // 9.
    const nasabuh_altadawul =
      (alasulAlmutadawiluh?.thisYearBalance - inventory2?.thisYearBalance) /
      alkhusumAlmutadawiluh?.thisYearBalance;

    // 10.
    const nasabuh_altadawul_alsarie =
      (alasulAlmutadawiluh?.thisYearBalance -
        inventory2?.thisYearBalance -
        masrufat_muqadamih?.thisYearBalance) /
      alkhusumAlmutadawiluh?.thisYearBalance;

    // 11.
    const nasabuh_alnaqdih =
      (theBox?.thisYearBalance +
        theBanK?.thisYearBalance +
        accountsObject[accounts.arrestPapers]?.currentYear.balance || 0) /
      (accountsObject[accounts.awraqAldafe]?.currentYear.balance || 0);

    // 13.
    const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;

    const hamish_mujmal_alribh = mujmal_alribh / safi_almabieat;

    // 14.
    const tukalifuh_albidaeuh_almubaeuh =
      (accountsObject[accounts.sales]?.currentYear.balance || 0) +
      (accountsObject[accounts.salesReturns]?.currentYear.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.currentYear.balance || 0) -
      makhzun_akhir_alfatrih?.thisYearBalance;

    const alribh_altashghiliu_qabl_aldarayib =
      safi_almabieat -
      tukalifuh_albidaeuh_almubaeuh +
      ayradat_akhari?.thisYearBalance -
      (masarifAdarih?.thisYearBalance + masarifTaswiqayh?.thisYearBalance);

    const hamish_alribh_altashghilii = alribh_altashghiliu / safi_almabieat;

    // 15.
    const safi_alribh =
      alribh_altashghiliu_qabl_aldarayib -
      (accountsObject[accounts.daribuhAlmabieat]?.currentYear.balance || 0);

    const hamish_safi_alribh = safi_alribh / safi_almabieat;

    // 16.

    const alasulCurrent =
      alasulAlmutadawiluh?.thisYearBalance + alasulAlthaabatuh?.thisYearBalance;

    const alasulPrev =
      alasulAlmutadawiluh?.previousYearsBalance +
      alasulAlthaabatuh?.previousYearsBalance;

    const mutawasit_alasul = (alasulCurrent + alasulPrev) / 2;

    const mueadal_dawaran_alasul = safi_almabieat / mutawasit_alasul;

    // 17.
    const aleayid_eali_alasul = safi_alribh / mutawasit_alasul;

    // 18.
    const nasabah_almadiunih =
      (qurudQasiruhAlajil?.thisYearBalance +
        qurudTawiluhAlajil?.thisYearBalance) /
      alasulCurrent;

    // 19.
    const nasabah_almalkih = huquqAlmalakih?.thisYearBalance / alasulCurrent;

    // 20.
    const mutawasit_alaistithmar =
      (ras_almal?.thisYearBalance + ras_almal?.previousYearsBalance) / 2;

    // 21.
    const mutawasit_alribh = safi_alribh / 2;

    const mueadal_aleayid_almuhasabii =
      mutawasit_alribh / mutawasit_alaistithmar;

    // 22.
    const almuazinuh_alnaqdayh =
      theBox?.thisYearBalance + theBox?.previousYearsBalance;

    // 23.
    const mutawasit_almadinin =
      (clients?.thisYearBalance + clients?.previousYearsBalance) / 2;

    const mueadal_dawaran_almadinin =
      (accountsObject[accounts.arrestPapers]?.currentYear.balance ||
        0 + clients?.thisYearBalance) / mutawasit_almadinin;

    // 25.
    const mutawasit_fatrih_altahsil = mueadal_dawaran_almadinin / 365;

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
      nasabah_almadiunih: parseFloat(nasabah_almadiunih.toFixed(3)),
      nasabah_almalkih: parseFloat(nasabah_almalkih.toFixed(3)),
      mutawasit_alaistithmar: parseFloat(mutawasit_alaistithmar.toFixed(3)),
      mueadal_aleayid_almuhasabii: parseFloat(
        mueadal_aleayid_almuhasabii.toFixed(3)
      ),
      almuazinuh_alnaqdayh,
      mueadal_dawaran_almadinin: parseFloat(
        mueadal_dawaran_almadinin.toFixed(3)
      ),
      mutawasit_almadinin: parseFloat(mutawasit_almadinin.toFixed(3)),
      mutawasit_fatrih_altahsil: parseFloat(
        mutawasit_fatrih_altahsil.toFixed(3)
      ),
    });
  } catch (error) {
    next(error);
  }
};
