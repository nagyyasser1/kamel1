"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountsService_1 = __importDefault(require("../../services/accountsService"));
const accountsCodes_1 = require("../../constants/accountsCodes");
const categoryService_1 = __importDefault(require("../../services/categoryService"));
const altadafuqAlnaqdiuCtl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const makhzun_akhir_alfatrih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventoryAtTheEndOfThePeriod);
        const almakhzun = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventory2);
        const masrufatMustahaqa = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masrufatMustahaqa);
        const clients = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.clients);
        const almoredenBase = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.almoreden);
        const alMothsatat = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alMothsatat);
        const ayradat_akhari = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.otherRevenues);
        const masarifAdarih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifAdarih);
        const masarifTaswiqayh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifTaswiqayh);
        const jariAlshurakaBase = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.jariAlshuraka);
        const ras_almalBase = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.ras_almal);
        const daribuhAlmabieat = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.daribuhAlmabieat);
        const sales = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.sales);
        const allowedDiscount = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.allowedDiscount);
        const salesReturns = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.salesReturns);
        const purchaseReturns = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.purchaseReturns);
        const arbahRasimaliaBase = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.arbahRasimalia);
        const safi_almabieat = (((_a = sales.currentYear) === null || _a === void 0 ? void 0 : _a.balance) || 0) -
            ((((_b = allowedDiscount.currentYear) === null || _b === void 0 ? void 0 : _b.balance) || 0) +
                (((_c = salesReturns.currentYear) === null || _c === void 0 ? void 0 : _c.balance) || 0));
        const tukalifuh_albidaeuh_almubaeuh = (((_d = sales.currentYear) === null || _d === void 0 ? void 0 : _d.balance) || 0) +
            (((_e = salesReturns.currentYear) === null || _e === void 0 ? void 0 : _e.balance) || 0) +
            (((_f = purchaseReturns.currentYear) === null || _f === void 0 ? void 0 : _f.balance) || 0) -
            makhzun_akhir_alfatrih.thisYearBalance;
        const alribh_altashghiliu_qabl_aldarayib = safi_almabieat -
            tukalifuh_albidaeuh_almubaeuh +
            ayradat_akhari.thisYearBalance -
            (masarifAdarih.thisYearBalance + masarifTaswiqayh.thisYearBalance);
        const safi_alribh = alribh_altashghiliu_qabl_aldarayib -
            (((_g = daribuhAlmabieat.currentYear) === null || _g === void 0 ? void 0 : _g.balance) || 0);
        const ahlak_alasul_althaabitih = alMothsatat.thisYearBalance + alMothsatat.previousYearsBalance;
        const arbah_khasayir_altashghil = safi_alribh + alMothsatat.thisYearBalance;
        const al_makhzun = almakhzun.thisYearBalance - almakhzun.previousYearsBalance;
        const masrufat_mustahaqa = masrufatMustahaqa.thisYearBalance -
            masrufatMustahaqa.previousYearsBalance;
        const aleumala = clients.thisYearBalance - clients.previousYearsBalance;
        const almoreden = almoredenBase.thisYearBalance - almoredenBase.previousYearsBalance;
        const jari_alshuraka = jariAlshurakaBase.thisYearBalance -
            jariAlshurakaBase.previousYearsBalance;
        const safi_altadafuqat_alnaqdayh = al_makhzun + almoreden + aleumala + jari_alshuraka + masrufat_mustahaqa;
        const arbah_rasi_malia = (((_h = arbahRasimaliaBase.currentYear) === null || _h === void 0 ? void 0 : _h.balance) || 0) -
            (((_j = arbahRasimaliaBase.currentYear) === null || _j === void 0 ? void 0 : _j.balance) || 0);
        const madfueat_lishira_asul_thabatih = 404;
        const safi_altadafuqat_alnaqdayh_min_alaistithmar = arbah_rasi_malia + madfueat_lishira_asul_thabatih;
        const ras_almal = ras_almalBase.thisYearBalance - ras_almalBase.previousYearsBalance;
        const alziyadah_alnaqs_fi_alaihtiatii = 404;
        const safi_altadafuqat_alnaqdayh_min_aliainshitih_altamwilih = 404;
        const naqdih_bialkhazinih = 404;
        const naqdih_bialbunuk = 404;
        const rasid_alnaqdayh_awil_aleam = 404;
        res.json({
            safi_alribh,
            ahlak_alasul_althaabitih,
            arbah_khasayir_altashghil,
            al_makhzun,
            masrufat_mustahaqa,
            aleumala,
            almoreden,
            jari_alshuraka,
            safi_altadafuqat_alnaqdayh,
            madfueat_lishira_asul_thabatih,
            arbah_rasi_malia,
            safi_altadafuqat_alnaqdayh_min_alaistithmar,
            ras_almal,
            alziyadah_alnaqs_fi_alaihtiatii,
            safi_altadafuqat_alnaqdayh_min_aliainshitih_altamwilih,
            rasid_alnaqdayh_awil_aleam,
            naqdih_bialkhazinih,
            naqdih_bialbunuk,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = altadafuqAlnaqdiuCtl;
