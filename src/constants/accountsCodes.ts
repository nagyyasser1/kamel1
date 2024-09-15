const ACCOUNTS_CODES_FOR_INCOME = [
  4101, 4102, 4103, 120301, 120701, 120401, 5101, 5102, 5103, 5104, 5105, 5106,
  5107, 5201, 5202, 5203, 5204, 5205, 5206, 5207, 5208, 5209, 5210, 5211, 5212,
  5213, 5214, 5215, 5216, 5217, 5218, 5219, 5301, 5302, 5303, 5304, 5305, 5306,
  5307, 5401, 5402, 5403, 5404, 220201, 5501,
];

export const CategoryWname = {
  inventoryAtTheEndOfThePeriod: 120602,
  activitySalesRevenue: 41,
  otherRevenues: 42,
};

export const AccountsWname = {
  sales: 4101,
  salesReturns: 4102,
  allowedDiscount: 4103,
  purchases: 120301,
  purchasesExpenses: 120701,
  purchaseReturns: 120401,

  freeSamplesAndGifts: 5101,
  propagandaAndAdvertising: 5102,
  sellingAgentsCommission: 5103,
  shippingAndDeliveryOfOrders: 5104,
  damagedAndFinishedGoods: 5105,
  inventoryAdjustments: 5106,
  packagingAndPackingExpenses: 5107,

  salariesOfExecutivesAndOfficials: 5201,
  travelAndTransportation: 5202,
  bankCommissions: 5203,
  accountingAuditAndConsultingExpenses: 5204,
  rewardsAndPerks: 5205,
  workPermits: 5206,
  travelTickets: 5207,
  compensationForLeavingService: 5208,
  badDebts: 5209,
  healthInsurance: 5210,
  currencyConversionDifferences: 5211,
  otherMiscellaneousExpenses: 5212,
  stationeryAndPublications: 5213,
  hospitalityAndReception: 5214,
  socialInsurance: 5215,
  trafficViolations: 5216,
  treatmentAndMedicalExamination: 5217,
  cleaningExpenses: 5218,
  governmentFees: 5219,

  carWash: 5301,
  carFuel: 5302,
  rentals: 5303,
  electricityAndWater: 5304,
  wagesAndSalaries: 5305,
  generalMaintenanceExpenses: 5306,
  telephoneMailInternet: 5307,

  transportationDepreciationExpense: 5401,
  hardwareSoftwareDepreciationExpense: 5402,
  furnitureFurnishingsDepreciationExpense: 5403,
  depreciationExpenseForMachineryEquipment: 5404,

  daribuhAldukhl: 5501,

  salesOutputTax: 220201,
};

//المزانيه العموميه "المركز المالي FB
export const FP_accounts = [
  110101, 110102, 110103, 110104, 110105, 110106, 110201, 110202, 110203,
  220701, 220501, 220401, 220301, 220201, 120401, 120301, 120701, 1201, 2101,
  2102, 2103, 120501, 120801, 220601,
];

export const FP_accounts_names = {
  lands: 110101,
  buildingsAndRealEstate: 110102,
  furnitureAndFurnishings: 110103,
  machinesAndEquipment: 110104,
  cars: 110105,
  otherAssets: 110106,
  fame: 110201,
  programs: 110202,
  patent: 110203,
  otherAccountsReceivable: 220701,
  ayradatMuqadamuh: 220501,
  masrufatMustahiqih: 220401,
  daribuhAlmabieat: 220201,
  purchaseReturns: 120401,
  purchases: 120301,
  purchasesExpenses: 120701,
  cash: 1201,

  alqurudQasiruhAlajil: 220301,
  qurudTawiluhAlajil: 2101,

  althanadatTawiluhAlajil: 2102,
  aldarayibAlmuajala: 2103,
  arrestPapers: 120501,
  hisabMadinatAkhari: 120801,
  awraqAldafe: 220601,
};

export const FP_categories_codes = [
  120601, 120602, 121201, 121202, 120201, 120202, 120101, 120102, 54, 220101,
  220102, 31, 32, 33, 34,
];

export const FP_categories_names = {
  inventory1: 120601,
  inventory2: 120602,
  clientsAbroad: 121201,
  clientsInside: 121202,
  ancestor: 120201,
  covenant: 120202,
  theBox: 120101,
  theBanK: 120102,
  alMothsatat: 54,
  almoredenOutside: 220101,
  almoredenInside: 220102,
  capital: 31,
  jariAlshuraka: 32,
  alaribahAlmuhtajazuh: 33,
  alaihtiatat: 34,
};

export const accounts = {
  sales: 4101,
  salesReturns: 4102,
  allowedDiscount: 4103,
  purchases: 120301,
  purchasesExpenses: 120701,
  purchaseReturns: 120401,
  freeSamplesAndGifts: 5101,
  propagandaAndAdvertising: 5102,
  sellingAgentsCommission: 5103,
  shippingAndDeliveryOfOrders: 5104,
  damagedAndFinishedGoods: 5105,
  inventoryAdjustments: 5106,
  packagingAndPackingExpenses: 5107,
  salariesOfExecutivesAndOfficials: 5201,
  travelAndTransportation: 5202,
  bankCommissions: 5203,
  accountingAuditAndConsultingExpenses: 5204,
  rewardsAndPerks: 5205,
  workPermits: 5206,
  travelTickets: 5207,
  compensationForLeavingService: 5208,
  badDebts: 5209,
  healthInsurance: 5210,
  currencyConversionDifferences: 5211,
  otherMiscellaneousExpenses: 5212,
  stationeryAndPublications: 5213,
  hospitalityAndReception: 5214,
  socialInsurance: 5215,
  trafficViolations: 5216,
  treatmentAndMedicalExamination: 5217,
  cleaningExpenses: 5218,
  governmentFees: 5219,
  carWash: 5301,
  carFuel: 5302,
  rentals: 5303,
  electricityAndWater: 5304,
  wagesAndSalaries: 5305,
  generalMaintenanceExpenses: 5306,
  telephoneMailInternet: 5307,
  transportationDepreciationExpense: 5401,
  hardwareSoftwareDepreciationExpense: 5402,
  furnitureFurnishingsDepreciationExpense: 5403,
  depreciationExpenseForMachineryEquipment: 5404,
  daribuhAldukhl: 5501,
  salesOutputTax: 220201,
  lands: 110101,
  buildingsAndRealEstate: 110102,
  furnitureAndFurnishings: 110103,
  machinesAndEquipment: 110104,
  cars: 110105,
  otherAssets: 110106,
  fame: 110201,
  programs: 110202,
  patent: 110203,
  otherAccountsReceivable: 220701,
  ayradatMuqadamuh: 220501,
  masrufatMustahiqih: 220401,
  daribuhAlmabieat: 220201,
  cash: 1201,
  qurudTawiluhAlajil: 2101,
  alqurudQasiruhAlajil: 220301,
  althanadatTawiluhAlajil: 2102,
  aldarayibAlmuajala: 2103,
  arrestPapers: 120501,
  hisabMadinatAkhari: 120801,
  awraqAldafe: 220601,
  khasmuktasib: 121001,
};

export const categories = {
  inventory1: 120601,
  inventory2: 120602,
  clientsAbroad: 121201,
  clientsInside: 121202,
  ancestor: 120201,
  covenant: 120202,
  theBox: 120101,
  theBanK: 120102,
  alMothsatat: 54,
  almoredenOutside: 220101,
  almoredenInside: 220102,
  capital: 31,
  jariAlshuraka: 32,
  alaribahAlmuhtajazuh: 33,
  alaihtiatat: 34,
  inventoryAtTheEndOfThePeriod: 120602,
  activitySalesRevenue: 41,
  otherRevenues: 42,
  masarifTaswiqayh: 51,
  masarifAdarih: 52,
  masarifTashghilayh: 53,
  alasulAlthaabatuh: 11,
  alasulAlmutadawiluh: 12,
  alkhusumAlthaabatuh: 21,
  alkhusumAlmutadawiluh: 22,
  huquqAlmalakih: 3,
};

export default ACCOUNTS_CODES_FOR_INCOME;
