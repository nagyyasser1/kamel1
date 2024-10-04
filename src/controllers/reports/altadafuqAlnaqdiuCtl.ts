import accountsService from "../../services/accountsService";
import { accounts, categories } from "../../constants/accountsCodes";
import categoryService from "../../services/categoryService";
import { NextFunction, Request, Response } from "express";

const altadafuqAlnaqdiuCtl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**Categories Balances */
    const makhzun_akhir_alfatrih = await categoryService.getCategoryBalance(
      categories.inventoryAtTheEndOfThePeriod
    );

    const almakhzun = await categoryService.getCategoryBalance(
      categories.inventory2
    );

    const masrufatMustahaqa = await categoryService.getCategoryBalance(
      categories.masrufatMustahaqa
    );

    const clients = await categoryService.getCategoryBalance(
      categories.clients
    );

    const almoredenBase = await categoryService.getCategoryBalance(
      categories.almoreden
    );

    const alMothsatat = await categoryService.getCategoryBalance(
      categories.alMothsatat
    );

    const ayradat_akhari = await categoryService.getCategoryBalance(
      categories.otherRevenues
    );

    const masarifAdarih = await categoryService.getCategoryBalance(
      categories.masarifAdarih
    );

    const masarifTaswiqayh = await categoryService.getCategoryBalance(
      categories.masarifTaswiqayh
    );

    const jariAlshurakaBase = await categoryService.getCategoryBalance(
      categories.jariAlshuraka
    );

    const ras_almalBase = await categoryService.getCategoryBalance(
      categories.ras_almal
    );

    /**Accounts Balances */
    const salesOutputTax = await accountsService.getAccountBalance(
      accounts.salesOutputTax
    );

    const sales = await accountsService.getAccountBalance(accounts.sales);

    const allowedDiscount = await accountsService.getAccountBalance(
      accounts.allowedDiscount
    );

    const salesReturns = await accountsService.getAccountBalance(
      accounts.salesReturns
    );

    const purchaseReturns = await accountsService.getAccountBalance(
      accounts.purchaseReturns
    );

    const arbahRasimaliaBase = await accountsService.getAccountBalance(
      accounts.arbahRasimalia
    );

    /**Equations */
    //1
    const safi_almabieat =
      sales.thisYearBalance -
      allowedDiscount.thisYearBalance -
      salesReturns.thisYearBalance;

    const tukalifuh_albidaeuh_almubaeuh =
      sales.thisYearBalance +
      salesReturns.thisYearBalance +
      purchaseReturns.thisYearBalance -
      makhzun_akhir_alfatrih.thisYearBalance;

    const alribh_altashghiliu_qabl_aldarayib =
      safi_almabieat -
      tukalifuh_albidaeuh_almubaeuh +
      ayradat_akhari.thisYearBalance -
      (masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance);

    const safi_alribh =
      alribh_altashghiliu_qabl_aldarayib - salesOutputTax.thisYearBalance;

    const ahlak_alasul_althaabitih =
      alMothsatat.thisYearBalance + alMothsatat.previousYearsBalance;

    const arbah_khasayir_altashghil = safi_alribh + alMothsatat.thisYearBalance;

    const al_makhzun =
      almakhzun.thisYearBalance - almakhzun.previousYearsBalance;

    const masrufat_mustahaqa =
      masrufatMustahaqa.thisYearBalance -
      masrufatMustahaqa.previousYearsBalance;

    const aleumala = clients.thisYearBalance - clients.previousYearsBalance;

    const almoreden =
      almoredenBase.thisYearBalance - almoredenBase.previousYearsBalance;

    const jari_alshuraka =
      jariAlshurakaBase.thisYearBalance -
      jariAlshurakaBase.previousYearsBalance;

    const safi_altadafuqat_alnaqdayh =
      al_makhzun + almoreden + aleumala + jari_alshuraka + masrufat_mustahaqa;

    const arbah_rasi_malia =
      arbahRasimaliaBase.thisYearBalance -
      arbahRasimaliaBase.previousYearsBalance;

    const madfueat_lishira_asul_thabatih = 404;

    const safi_altadafuqat_alnaqdayh_min_alaistithmar =
      arbah_rasi_malia + madfueat_lishira_asul_thabatih;

    const ras_almal =
      ras_almalBase.thisYearBalance - ras_almalBase.previousYearsBalance;

    const alziyadah_alnaqs_fi_alaihtiatii = 404;

    const safi_altadafuqat_alnaqdayh_min_aliainshitih_altamwilih = 404;

    const naqdih_bialkhazinih = 404;

    const naqdih_bialbunuk = 404;

    const rasid_alnaqdayh_awil_aleam = 404;
    res.json({
      //one
      safi_alribh,
      ahlak_alasul_althaabitih,
      arbah_khasayir_altashghil,
      //two
      al_makhzun,
      masrufat_mustahaqa,
      aleumala,
      almoreden,
      jari_alshuraka,
      safi_altadafuqat_alnaqdayh,
      //three
      madfueat_lishira_asul_thabatih,
      arbah_rasi_malia, // متحصلات من بيع اصول ثابته
      safi_altadafuqat_alnaqdayh_min_alaistithmar,
      //four
      ras_almal,
      alziyadah_alnaqs_fi_alaihtiatii,
      safi_altadafuqat_alnaqdayh_min_aliainshitih_altamwilih,
      //five
      rasid_alnaqdayh_awil_aleam,
      //six
      naqdih_bialkhazinih,
      naqdih_bialbunuk,
    });
  } catch (error) {
    next(error);
  }
};

export default altadafuqAlnaqdiuCtl;
