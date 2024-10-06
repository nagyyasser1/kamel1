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
const categoryService_1 = __importDefault(require("../../services/categoryService"));
const accountsService_1 = __importDefault(require("../../services/accountsService"));
const accountsCodes_1 = require("../../constants/accountsCodes");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        const { accountsObject } = yield accountsService_1.default.getAccountsBalances();
        const alasulAlthaabatuh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alasulAlthaabatuh);
        const inventory2 = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventory2);
        const alasulAlmutadawiluh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alasulAlmutadawiluh);
        const alkhusumAlmutadawiluh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alkhusumAlmutadawiluh);
        const alkhusumAlthaabatuh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alkhusumAlthaabatuh);
        const alkhusum = alkhusumAlmutadawiluh.thisYearBalance +
            alkhusumAlthaabatuh.thisYearBalance;
        const masarifAdarih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifAdarih);
        const masarifTaswiqayh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifTaswiqayh);
        const theBanK = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.theBanK);
        const theBox = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.theBox);
        const masarifTashghilayh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifTashghilayh);
        const huquqAlmalakih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.huquqAlmalakih);
        const masrufat_muqadamih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masrufat_muqadamih);
        const makhzun_akhir_alfatrih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventoryAtTheEndOfThePeriod);
        const ras_almal = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.ras_almal);
        const inventory1 = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventory1);
        const ayradat_akhari = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.otherRevenues);
        const clients = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.clients);
        const qurudTawiluhAlajil = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.qurudTawiluhAlajil);
        const qurudQasiruhAlajil = yield accountsService_1.default.getAccountBalance(accountsCodes_1.accounts.alqurudQasiruhAlajil);
        const safi_almabieat = (((_a = accountsObject[accountsCodes_1.accounts.sales]) === null || _a === void 0 ? void 0 : _a.currentYear.balance) || 0) -
            Math.abs((((_b = accountsObject[accountsCodes_1.accounts.allowedDiscount]) === null || _b === void 0 ? void 0 : _b.currentYear.balance) || 0) +
                (((_c = accountsObject[accountsCodes_1.accounts.salesReturns]) === null || _c === void 0 ? void 0 : _c.currentYear.balance) || 0));
        const safi_almushtariat = (((_d = accountsObject[accountsCodes_1.accounts.purchases]) === null || _d === void 0 ? void 0 : _d.currentYear.balance) || 0) +
            (((_e = accountsObject[accountsCodes_1.accounts.purchasesExpenses]) === null || _e === void 0 ? void 0 : _e.currentYear.balance) || 0) -
            (((_f = accountsObject[accountsCodes_1.accounts.purchaseReturns]) === null || _f === void 0 ? void 0 : _f.currentYear.balance) || 0) -
            (((_g = accountsObject[accountsCodes_1.accounts.khasmuktasib]) === null || _g === void 0 ? void 0 : _g.currentYear.balance) || 0);
        const tukalifuh_almabieat = (inventory2 === null || inventory2 === void 0 ? void 0 : inventory2.previousYearsBalance) +
            safi_almushtariat -
            (inventory2 === null || inventory2 === void 0 ? void 0 : inventory2.thisYearBalance);
        const alribh_altashghiliu = safi_almabieat - tukalifuh_almabieat;
        const safi_aldukhl = alribh_altashghiliu - (masarifAdarih === null || masarifAdarih === void 0 ? void 0 : masarifAdarih.thisYearBalance);
        const altadafuq_alnaqdiu_min_alqurud = (qurudQasiruhAlajil === null || qurudQasiruhAlajil === void 0 ? void 0 : qurudQasiruhAlajil.thisYearBalance) +
            (qurudTawiluhAlajil === null || qurudTawiluhAlajil === void 0 ? void 0 : qurudTawiluhAlajil.thisYearBalance) -
            ((qurudQasiruhAlajil === null || qurudQasiruhAlajil === void 0 ? void 0 : qurudQasiruhAlajil.previousYearsBalance) +
                (qurudTawiluhAlajil === null || qurudTawiluhAlajil === void 0 ? void 0 : qurudTawiluhAlajil.previousYearsBalance));
        const ras_almal_aleamil = (alasulAlmutadawiluh === null || alasulAlmutadawiluh === void 0 ? void 0 : alasulAlmutadawiluh.thisYearBalance) -
            (inventory2 === null || inventory2 === void 0 ? void 0 : inventory2.thisYearBalance) -
            (alkhusumAlmutadawiluh === null || alkhusumAlmutadawiluh === void 0 ? void 0 : alkhusumAlmutadawiluh.thisYearBalance);
        const ras_almal_almustathmir = (alasulAlthaabatuh === null || alasulAlthaabatuh === void 0 ? void 0 : alasulAlthaabatuh.thisYearBalance) - ras_almal_aleamil;
        const ajamali_altamwil = (alkhusumAlthaabatuh === null || alkhusumAlthaabatuh === void 0 ? void 0 : alkhusumAlthaabatuh.thisYearBalance) + (huquqAlmalakih === null || huquqAlmalakih === void 0 ? void 0 : huquqAlmalakih.thisYearBalance);
        const nasabuh_altadawul = ((alasulAlmutadawiluh === null || alasulAlmutadawiluh === void 0 ? void 0 : alasulAlmutadawiluh.thisYearBalance) - (inventory2 === null || inventory2 === void 0 ? void 0 : inventory2.thisYearBalance)) /
            (alkhusumAlmutadawiluh === null || alkhusumAlmutadawiluh === void 0 ? void 0 : alkhusumAlmutadawiluh.thisYearBalance);
        const nasabuh_altadawul_alsarie = ((alasulAlmutadawiluh === null || alasulAlmutadawiluh === void 0 ? void 0 : alasulAlmutadawiluh.thisYearBalance) -
            (inventory2 === null || inventory2 === void 0 ? void 0 : inventory2.thisYearBalance) -
            (masrufat_muqadamih === null || masrufat_muqadamih === void 0 ? void 0 : masrufat_muqadamih.thisYearBalance)) /
            (alkhusumAlmutadawiluh === null || alkhusumAlmutadawiluh === void 0 ? void 0 : alkhusumAlmutadawiluh.thisYearBalance);
        const nasabuh_alnaqdih = ((theBox === null || theBox === void 0 ? void 0 : theBox.thisYearBalance) +
            (theBanK === null || theBanK === void 0 ? void 0 : theBanK.thisYearBalance) +
            ((_h = accountsObject[accountsCodes_1.accounts.arrestPapers]) === null || _h === void 0 ? void 0 : _h.currentYear.balance) || 0) /
            (((_j = accountsObject[accountsCodes_1.accounts.awraqAldafe]) === null || _j === void 0 ? void 0 : _j.currentYear.balance) || 0);
        const mujmal_alribh = safi_almabieat - tukalifuh_almabieat;
        const hamish_mujmal_alribh = mujmal_alribh / safi_almabieat;
        const tukalifuh_albidaeuh_almubaeuh = (((_k = accountsObject[accountsCodes_1.accounts.sales]) === null || _k === void 0 ? void 0 : _k.currentYear.balance) || 0) +
            (((_l = accountsObject[accountsCodes_1.accounts.salesReturns]) === null || _l === void 0 ? void 0 : _l.currentYear.balance) || 0) +
            (((_m = accountsObject[accountsCodes_1.accounts.purchaseReturns]) === null || _m === void 0 ? void 0 : _m.currentYear.balance) || 0) -
            (makhzun_akhir_alfatrih === null || makhzun_akhir_alfatrih === void 0 ? void 0 : makhzun_akhir_alfatrih.thisYearBalance);
        const alribh_altashghiliu_qabl_aldarayib = safi_almabieat -
            tukalifuh_albidaeuh_almubaeuh +
            (ayradat_akhari === null || ayradat_akhari === void 0 ? void 0 : ayradat_akhari.thisYearBalance) -
            ((masarifAdarih === null || masarifAdarih === void 0 ? void 0 : masarifAdarih.thisYearBalance) + (masarifTaswiqayh === null || masarifTaswiqayh === void 0 ? void 0 : masarifTaswiqayh.thisYearBalance));
        const hamish_alribh_altashghilii = alribh_altashghiliu / safi_almabieat;
        const safi_alribh = alribh_altashghiliu_qabl_aldarayib -
            (((_o = accountsObject[accountsCodes_1.accounts.daribuhAlmabieat]) === null || _o === void 0 ? void 0 : _o.currentYear.balance) || 0);
        const hamish_safi_alribh = safi_alribh / safi_almabieat;
        const alasulCurrent = (alasulAlmutadawiluh === null || alasulAlmutadawiluh === void 0 ? void 0 : alasulAlmutadawiluh.thisYearBalance) + (alasulAlthaabatuh === null || alasulAlthaabatuh === void 0 ? void 0 : alasulAlthaabatuh.thisYearBalance);
        const alasulPrev = (alasulAlmutadawiluh === null || alasulAlmutadawiluh === void 0 ? void 0 : alasulAlmutadawiluh.previousYearsBalance) +
            (alasulAlthaabatuh === null || alasulAlthaabatuh === void 0 ? void 0 : alasulAlthaabatuh.previousYearsBalance);
        const mutawasit_alasul = (alasulCurrent + alasulPrev) / 2;
        const mueadal_dawaran_alasul = safi_almabieat / mutawasit_alasul;
        const aleayid_eali_alasul = safi_alribh / mutawasit_alasul;
        const nasabah_almadiunih = ((qurudQasiruhAlajil === null || qurudQasiruhAlajil === void 0 ? void 0 : qurudQasiruhAlajil.thisYearBalance) +
            (qurudTawiluhAlajil === null || qurudTawiluhAlajil === void 0 ? void 0 : qurudTawiluhAlajil.thisYearBalance)) /
            alasulCurrent;
        const nasabah_almalkih = (huquqAlmalakih === null || huquqAlmalakih === void 0 ? void 0 : huquqAlmalakih.thisYearBalance) / alasulCurrent;
        const mutawasit_alaistithmar = ((ras_almal === null || ras_almal === void 0 ? void 0 : ras_almal.thisYearBalance) + (ras_almal === null || ras_almal === void 0 ? void 0 : ras_almal.previousYearsBalance)) / 2;
        const mutawasit_alribh = safi_alribh / 2;
        const mueadal_aleayid_almuhasabii = mutawasit_alribh / mutawasit_alaistithmar;
        const almuazinuh_alnaqdayh = (theBox === null || theBox === void 0 ? void 0 : theBox.thisYearBalance) + (theBox === null || theBox === void 0 ? void 0 : theBox.previousYearsBalance);
        const mutawasit_almadinin = ((clients === null || clients === void 0 ? void 0 : clients.thisYearBalance) + (clients === null || clients === void 0 ? void 0 : clients.previousYearsBalance)) / 2;
        const mueadal_dawaran_almadinin = (((_p = accountsObject[accountsCodes_1.accounts.arrestPapers]) === null || _p === void 0 ? void 0 : _p.currentYear.balance) ||
            0 + (clients === null || clients === void 0 ? void 0 : clients.thisYearBalance)) / mutawasit_almadinin;
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
            nasabuh_altadawul_alsarie: parseFloat(nasabuh_altadawul_alsarie.toFixed(3)),
            nasabuh_alnaqdih: parseFloat(nasabuh_alnaqdih.toFixed(3)),
            ras_almal_aleamil,
            hamish_mujmal_alribh: parseFloat(hamish_mujmal_alribh.toFixed(3)),
            hamish_alribh_altashghilii: parseFloat(hamish_alribh_altashghilii.toFixed(3)),
            hamish_safi_alribh: parseFloat(hamish_safi_alribh.toFixed(3)),
            mueadal_dawaran_alasul: parseFloat(mueadal_dawaran_alasul.toFixed(3)),
            aleayid_eali_alasul: parseFloat(aleayid_eali_alasul.toFixed(3)),
            nasabah_almadiunih: parseFloat(nasabah_almadiunih.toFixed(3)),
            nasabah_almalkih: parseFloat(nasabah_almalkih.toFixed(3)),
            mutawasit_alaistithmar: parseFloat(mutawasit_alaistithmar.toFixed(3)),
            mueadal_aleayid_almuhasabii: parseFloat(mueadal_aleayid_almuhasabii.toFixed(3)),
            almuazinuh_alnaqdayh,
            mueadal_dawaran_almadinin: parseFloat(mueadal_dawaran_almadinin.toFixed(3)),
            mutawasit_almadinin: parseFloat(mutawasit_almadinin.toFixed(3)),
            mutawasit_fatrih_altahsil: parseFloat(mutawasit_fatrih_altahsil.toFixed(3)),
        });
    }
    catch (error) {
        next(error);
    }
});
