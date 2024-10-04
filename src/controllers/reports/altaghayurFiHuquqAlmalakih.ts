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

    const makhzun_akhir_alfatrih = await categoryService.getCategoryBalance(
      categories.inventoryAtTheEndOfThePeriod
    );

    const inventory2 = await categoryService.getCategoryBalance(
      categories.inventory2
    );

    const ayradat_akhari = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );

    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );

    const ras_almal = await categoryService.getCategoryBalance(
      categories.ras_almal
    );

    const safi_almabieat =
      (accountsObject[accounts.sales]?.currentYear?.balance || 0) -
      ((accountsObject[accounts.allowedDiscount]?.currentYear.balance || 0) -
        (accountsObject[accounts.salesReturns]?.currentYear.balance || 0));

    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );

    const tukalifuh_albidaeuh_almubaeuh =
      (accountsObject[accounts.sales]?.currentYear?.balance || 0) +
      (accountsObject[accounts.salesReturns]?.currentYear?.balance || 0) +
      (accountsObject[accounts.purchaseReturns]?.currentYear?.balance || 0) -
      (makhzun_akhir_alfatrih.thisYearBalance || 0);

    const alribh_altashghiliu_qabl_aldarayib =
      safi_almabieat -
      tukalifuh_albidaeuh_almubaeuh +
      ayradat_akhari.thisYearBalance -
      (masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance);

    const safi_alribh =
      alribh_altashghiliu_qabl_aldarayib -
      (accountsObject[accounts.daribuhAlmabieat]?.currentYear?.balance || 0);

    const mashubat_shakhsayh = 404;

    const ras_almal_fi_nihayih_alfatrah =
      ras_almal.previousYearsBalance +
      ras_almal.thisYearBalance +
      safi_alribh -
      mashubat_shakhsayh;

    const { category, ...ras_almal_without_category } = ras_almal;

    res.json({
      ras_almal: ras_almal_without_category,
      safi_alribh,
      mashubat_shakhsayh,
      ras_almal_fi_nihayih_alfatrah,
    });
  } catch (error) {
    next(error);
  }
};

export default altaghayurFiHuquqAlmalakih;
