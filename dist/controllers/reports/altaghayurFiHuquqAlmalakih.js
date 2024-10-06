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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountsService_1 = __importDefault(require("../../services/accountsService"));
const accountsCodes_1 = require("../../constants/accountsCodes");
const categoryService_1 = __importDefault(require("../../services/categoryService"));
const altaghayurFiHuquqAlmalakih = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { accountsObject } = yield accountsService_1.default.getAccountsBalances();
        const makhzun_akhir_alfatrih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.inventoryAtTheEndOfThePeriod);
        const ayradat_akhari = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.otherRevenues);
        const masarifTaswiqayh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifTaswiqayh);
        const masarifTashghilayh = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifTashghilayh);
        const masarifAdarih = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.masarifAdarih);
        const almukhasasat = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.alMothsatat);
        const daribuh_aldukhl = ((_a = accountsObject[accountsCodes_1.accounts.daribuhAldukhl]) === null || _a === void 0 ? void 0 : _a.currentYear.balance) || 0;
        const safi_almabieat = (((_b = accountsObject[accountsCodes_1.accounts.sales]) === null || _b === void 0 ? void 0 : _b.currentYear.balance) || 0) -
            Math.abs((((_c = accountsObject[accountsCodes_1.accounts.allowedDiscount]) === null || _c === void 0 ? void 0 : _c.currentYear.balance) || 0) +
                (((_d = accountsObject[accountsCodes_1.accounts.salesReturns]) === null || _d === void 0 ? void 0 : _d.currentYear.balance) || 0));
        const purchasesReturnedExpenses = (((_e = accountsObject[accountsCodes_1.accounts.purchases]) === null || _e === void 0 ? void 0 : _e.currentYear.balance) || 0) +
            (((_f = accountsObject[accountsCodes_1.accounts.purchaseReturns]) === null || _f === void 0 ? void 0 : _f.currentYear.balance) || 0) +
            (((_g = accountsObject[accountsCodes_1.accounts.purchasesExpenses]) === null || _g === void 0 ? void 0 : _g.currentYear.balance) || 0);
        const tukalifuh_albidaeuh_almubaeuh = purchasesReturnedExpenses +
            ((makhzun_akhir_alfatrih === null || makhzun_akhir_alfatrih === void 0 ? void 0 : makhzun_akhir_alfatrih.thisYearBalance) || 0);
        const mujmal_alribh = safi_almabieat - Math.abs(tukalifuh_albidaeuh_almubaeuh);
        const ajamali_ayradat_mukhtalifuh = mujmal_alribh + ((ayradat_akhari === null || ayradat_akhari === void 0 ? void 0 : ayradat_akhari.thisYearBalance) || 0);
        const ajamaliu_almasarif_4 = masarifAdarih.thisYearBalance +
            masarifTaswiqayh.thisYearBalance +
            almukhasasat.thisYearBalance +
            masarifTashghilayh.thisYearBalance;
        const alribh_qabl_aldarayib = ajamali_ayradat_mukhtalifuh - Math.abs(ajamaliu_almasarif_4);
        const alribh_baed_aldarayib = alribh_qabl_aldarayib - Math.abs(daribuh_aldukhl);
        const ras_almal = yield categoryService_1.default.getCategoryBalance(accountsCodes_1.categories.ras_almal);
        const mashubat_shakhsayh = 404;
        const ras_almal_fi_nihayih_alfatrah = ras_almal.previousYearsBalance +
            ras_almal.thisYearBalance +
            alribh_baed_aldarayib -
            mashubat_shakhsayh;
        const { category } = ras_almal, ras_almal_without_category = __rest(ras_almal, ["category"]);
        res.json({
            ras_almal: ras_almal_without_category,
            safi_alribh: alribh_baed_aldarayib,
            mashubat_shakhsayh,
            ras_almal_fi_nihayih_alfatrah,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = altaghayurFiHuquqAlmalakih;
