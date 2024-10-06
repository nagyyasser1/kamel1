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
const getCurrentYear_1 = __importDefault(require("../utils/getCurrentYear"));
const prisma_1 = __importDefault(require("../prisma"));
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.create({
        data,
    });
});
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.findMany({
        where: { parentId: null },
        include: {
            subCategories: {
                include: {
                    subCategories: {
                        include: {
                            subCategories: {
                                include: {
                                    subCategories: {
                                        include: {
                                            subCategories: {
                                                include: {
                                                    subCategories: {
                                                        include: {
                                                            subCategories: true,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
});
const getCategoriesWithNums = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        select: {
            name: true,
            number: true,
        },
    });
    return categories;
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.findUnique({
        where: { id },
        include: {
            subCategories: {
                include: {
                    subCategories: true,
                },
            },
            accounts: true,
        },
    });
});
const getCategoryStatistics = (id, code) => __awaiter(void 0, void 0, void 0, function* () {
    const whereCondition = {};
    if (id) {
        whereCondition.id = id;
    }
    if (code) {
        whereCondition.number = code;
    }
    const statistics = yield prisma_1.default.category.findUnique({
        where: whereCondition,
        include: {
            accounts: {
                include: {
                    sentTransactions: true,
                    receivedTransactions: true,
                },
            },
        },
    });
    if (!statistics)
        return null;
    const currentYear = new Date().getFullYear();
    const startOfCurrentYear = new Date(currentYear, 0, 1);
    const endOfCurrentYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    let categoryCurrentYearStats = {
        sentTotal: 0,
        receivedTotal: 0,
    };
    let categoryPreviousYearsStats = {
        sentTotal: 0,
        receivedTotal: 0,
    };
    const accountsStatistics = statistics.accounts.map((account) => {
        let currentYearStats = {
            sentTotal: 0,
            receivedTotal: 0,
        };
        let previousYearsStats = {
            sentTotal: 0,
            receivedTotal: 0,
        };
        account.sentTransactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            if (transactionDate >= startOfCurrentYear &&
                transactionDate <= endOfCurrentYear) {
                currentYearStats.sentTotal += transaction.amount;
                categoryCurrentYearStats.sentTotal += transaction.amount;
            }
            else {
                previousYearsStats.sentTotal += transaction.amount;
                categoryPreviousYearsStats.sentTotal += transaction.amount;
            }
        });
        account.receivedTransactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            if (transactionDate >= startOfCurrentYear &&
                transactionDate <= endOfCurrentYear) {
                currentYearStats.receivedTotal += transaction.amount;
                categoryCurrentYearStats.receivedTotal += transaction.amount;
            }
            else {
                previousYearsStats.receivedTotal += transaction.amount;
                categoryPreviousYearsStats.receivedTotal += transaction.amount;
            }
        });
        return {
            accountId: account.id,
            accountNumber: account.number,
            accountName: account.name,
            currentYearStats,
            previousYearsStats,
        };
    });
    let categoryCurrentYearStatsBalance = categoryCurrentYearStats.receivedTotal - categoryCurrentYearStats.sentTotal;
    let categoryPreviousYearsStatsBalance = categoryPreviousYearsStats.receivedTotal -
        categoryPreviousYearsStats.sentTotal;
    return {
        totalBalance: categoryCurrentYearStatsBalance + categoryPreviousYearsStatsBalance,
        currentYear: categoryCurrentYearStats,
        previousYears: categoryPreviousYearsStats,
    };
});
const getCategoryByNumber = (number) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.findUnique({
        where: { number },
        include: {
            subCategories: {
                include: {
                    subCategories: true,
                },
            },
        },
    });
});
const getCategoryThatHaveAccounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield prisma_1.default.category.findMany({
        where: {
            accounts: {
                some: {},
            },
        },
    });
    return categories;
});
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.category.update({
        where: { id },
        data,
    });
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findUnique({
        where: { id },
        include: {
            subCategories: true,
            accounts: true,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    if (category.subCategories.length > 0 || category.accounts.length > 0) {
        throw new Error("Cannot delete a category that has subcategories or accounts");
    }
    return prisma_1.default.category.delete({
        where: { id },
    });
});
function getCategoryTransactionSummaryForAllCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentYear = new Date().getFullYear();
        const startOfCurrentYear = new Date(`${currentYear}-01-01`);
        const startOfNextYear = new Date(`${currentYear + 1}-01-01`);
        const categories = yield prisma_1.default.category.findMany({
            select: {
                id: true,
                name: true,
                number: true,
                accounts: {
                    select: {
                        sentTransactions: {
                            select: {
                                amount: true,
                                createdAt: true,
                            },
                        },
                        receivedTransactions: {
                            select: {
                                amount: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        const results = yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
            const { id, name, number, accounts } = category;
            const thisYearSentTransactions = accounts.flatMap((account) => account.sentTransactions.filter((tx) => tx.createdAt >= startOfCurrentYear && tx.createdAt < startOfNextYear));
            const previousYearsSentTransactions = accounts.flatMap((account) => account.sentTransactions.filter((tx) => tx.createdAt < startOfCurrentYear));
            const thisYearReceivedTransactions = accounts.flatMap((account) => account.receivedTransactions.filter((tx) => tx.createdAt >= startOfCurrentYear && tx.createdAt < startOfNextYear));
            const previousYearsReceivedTransactions = accounts.flatMap((account) => account.receivedTransactions.filter((tx) => tx.createdAt < startOfCurrentYear));
            const thisYearTotalSentAmount = thisYearSentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            const thisYearTotalReceivedAmount = thisYearReceivedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            const previousYearsTotalSentAmount = previousYearsSentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            const previousYearsTotalReceivedAmount = previousYearsReceivedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
            const thisYearBalance = thisYearTotalReceivedAmount - thisYearTotalSentAmount;
            const previousYearsBalance = previousYearsTotalReceivedAmount - previousYearsTotalSentAmount;
            const totalBalance = thisYearBalance + previousYearsBalance;
            return {
                id,
                categoryName: name,
                categoryNumber: number,
                totalBalance,
                thisYear: {
                    totalSentTransactions: thisYearSentTransactions.length,
                    totalSentAmount: thisYearTotalSentAmount,
                    totalReceivedTransactions: thisYearReceivedTransactions.length,
                    totalReceivedAmount: thisYearTotalReceivedAmount,
                    balance: thisYearBalance,
                },
                previousYears: {
                    totalSentTransactions: previousYearsSentTransactions.length,
                    totalSentAmount: previousYearsTotalSentAmount,
                    totalReceivedTransactions: previousYearsReceivedTransactions.length,
                    totalReceivedAmount: previousYearsTotalReceivedAmount,
                    balance: previousYearsBalance,
                },
            };
        })));
        return results;
    });
}
function getCategoryTransactionSummary(categoryNumber, categoryName) {
    return __awaiter(this, void 0, void 0, function* () {
        let categoryFilter = {};
        if (categoryName && categoryName.trim() !== "") {
            categoryFilter.name = {
                contains: categoryName,
                mode: "insensitive",
            };
        }
        if (categoryNumber && categoryNumber.trim() !== "") {
            categoryFilter.number = categoryNumber;
        }
        const rootCategory = yield prisma_1.default.category.findFirst({
            where: Object.assign({}, categoryFilter),
            include: {
                subCategories: {
                    include: {
                        subCategories: true,
                    },
                },
            },
        });
        if (!rootCategory) {
            return [];
        }
        const fetchAllSubCategoryIds = (category) => {
            const ids = [category.id];
            if (category.subCategories && category.subCategories.length > 0) {
                for (const subCategory of category.subCategories) {
                    ids.push(...fetchAllSubCategoryIds(subCategory));
                }
            }
            return ids;
        };
        const categoryIds = fetchAllSubCategoryIds(rootCategory);
        const currentDate = new Date();
        const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);
        const currentYearEnd = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        const previousYearStart = new Date(currentDate.getFullYear() - 1, 0, 1);
        const previousYearEnd = new Date(currentDate.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        const accounts = yield prisma_1.default.account.findMany({
            where: {
                categoryId: {
                    in: categoryIds,
                },
            },
            select: {
                id: true,
                name: true,
                number: true,
            },
        });
        if (!accounts || accounts.length === 0) {
            return [];
        }
        const accountIds = accounts.map((account) => account.id);
        const [currentYearTransactions, previousYearTransactions] = yield Promise.all([
            prisma_1.default.transaction.findMany({
                where: {
                    OR: [
                        {
                            fromId: { in: accountIds },
                            createdAt: { gte: currentYearStart, lte: currentYearEnd },
                        },
                        {
                            toId: { in: accountIds },
                            createdAt: { gte: currentYearStart, lte: currentYearEnd },
                        },
                    ],
                },
            }),
            prisma_1.default.transaction.findMany({
                where: {
                    OR: [
                        {
                            fromId: { in: accountIds },
                            createdAt: { gte: previousYearStart, lte: previousYearEnd },
                        },
                        {
                            toId: { in: accountIds },
                            createdAt: { gte: previousYearStart, lte: previousYearEnd },
                        },
                    ],
                },
            }),
        ]);
        const groupTransactions = (transactions, accountId, isReceived) => {
            return transactions.filter((t) => isReceived ? t.toId === accountId : t.fromId === accountId);
        };
        const transactionSummary = accounts.map((account) => {
            const currentYearSent = groupTransactions(currentYearTransactions, account.id, false);
            const currentYearReceived = groupTransactions(currentYearTransactions, account.id, true);
            const previousYearSent = groupTransactions(previousYearTransactions, account.id, false);
            const previousYearReceived = groupTransactions(previousYearTransactions, account.id, true);
            const sumAmount = (transactions) => transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            const thisYearBalance = sumAmount(currentYearReceived) - sumAmount(currentYearSent);
            const previousYearBalance = sumAmount(previousYearReceived) - sumAmount(previousYearSent);
            const totalBalance = previousYearBalance + thisYearBalance;
            return {
                id: account.id,
                number: account.number,
                name: account.name,
                totalBalance,
                currentYear: {
                    balance: thisYearBalance,
                    sentTransactions: currentYearSent.length,
                    sentAmount: sumAmount(currentYearSent),
                    receivedTransactions: currentYearReceived.length,
                    receivedAmount: sumAmount(currentYearReceived),
                },
                previousYear: {
                    balance: previousYearBalance,
                    sentTransactions: previousYearSent.length,
                    sentAmount: sumAmount(previousYearSent),
                    receivedTransactions: previousYearReceived.length,
                    receivedAmount: sumAmount(previousYearReceived),
                },
            };
        });
        return transactionSummary;
    });
}
const getCategoriesBalances = () => __awaiter(void 0, void 0, void 0, function* () {
    const { currentYear, startOfYear, endOfYear } = (0, getCurrentYear_1.default)();
    const fetchCategoryWithSubcategories = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
            select: {
                id: true,
                name: true,
                number: true,
                parentId: true,
                accounts: {
                    select: {
                        sentTransactions: {
                            where: {
                                createdAt: {
                                    gte: startOfYear,
                                    lte: endOfYear,
                                },
                            },
                            select: {
                                amount: true,
                            },
                        },
                        receivedTransactions: {
                            where: {
                                createdAt: {
                                    gte: startOfYear,
                                    lte: endOfYear,
                                },
                            },
                            select: {
                                amount: true,
                            },
                        },
                    },
                },
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        number: true,
                    },
                },
            },
        });
        let totalSent = 0;
        let totalReceived = 0;
        category === null || category === void 0 ? void 0 : category.accounts.forEach((account) => {
            totalSent += account.sentTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
            totalReceived += account.receivedTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        });
        let balance = totalReceived - totalSent;
        const subCategoryBalances = yield Promise.all((category === null || category === void 0 ? void 0 : category.subCategories.map((subCategory) => __awaiter(void 0, void 0, void 0, function* () {
            return yield fetchCategoryWithSubcategories(subCategory.id);
        }))) || []);
        subCategoryBalances.forEach((subCategory) => {
            balance += subCategory.balance;
        });
        return {
            id: category === null || category === void 0 ? void 0 : category.id,
            name: category === null || category === void 0 ? void 0 : category.name,
            number: category === null || category === void 0 ? void 0 : category.number,
            balance,
            subCategories: subCategoryBalances,
        };
    });
    const topLevelCategories = yield prisma_1.default.category.findMany({
        where: {
            parentId: null,
        },
        select: {
            id: true,
        },
    });
    const categoriesWithBalances = yield Promise.all(topLevelCategories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
        return yield fetchCategoryWithSubcategories(category.id);
    })));
    return categoriesWithBalances;
});
const getCategoryBalance = (categoryNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const { startOfYear } = (0, getCurrentYear_1.default)();
    const calculateCategoryBalance = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
            select: {
                id: true,
                name: true,
                subCategories: {
                    select: {
                        id: true,
                        name: true,
                        number: true,
                        accounts: {
                            select: {
                                sentTransactions: {
                                    select: {
                                        amount: true,
                                        createdAt: true,
                                    },
                                },
                                receivedTransactions: {
                                    select: {
                                        amount: true,
                                        createdAt: true,
                                    },
                                },
                            },
                        },
                        subCategories: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
                accounts: {
                    select: {
                        sentTransactions: {
                            select: {
                                amount: true,
                                createdAt: true,
                            },
                        },
                        receivedTransactions: {
                            select: {
                                amount: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        let thisYearSent = 0;
        let thisYearReceived = 0;
        let previousYearsSent = 0;
        let previousYearsReceived = 0;
        category === null || category === void 0 ? void 0 : category.accounts.forEach((account) => {
            account.sentTransactions.forEach((transaction) => {
                if (transaction.createdAt >= startOfYear) {
                    thisYearSent += transaction.amount;
                }
                else {
                    previousYearsSent += transaction.amount;
                }
            });
            account.receivedTransactions.forEach((transaction) => {
                if (transaction.createdAt >= startOfYear) {
                    thisYearReceived += transaction.amount;
                }
                else {
                    previousYearsReceived += transaction.amount;
                }
            });
        });
        for (const subCategory of (category === null || category === void 0 ? void 0 : category.subCategories) || []) {
            const subCategoryBalance = yield calculateCategoryBalance(subCategory.id);
            thisYearSent += subCategoryBalance.thisYearSent;
            thisYearReceived += subCategoryBalance.thisYearReceived;
            previousYearsSent += subCategoryBalance.previousYearsSent;
            previousYearsReceived += subCategoryBalance.previousYearsReceived;
        }
        return {
            thisYearSent,
            thisYearReceived,
            previousYearsSent,
            previousYearsReceived,
        };
    });
    const category = yield prisma_1.default.category.findUnique({
        where: {
            number: categoryNumber,
        },
        select: {
            id: true,
            name: true,
            number: true,
            subCategories: {
                select: {
                    id: true,
                    name: true,
                    number: true,
                },
            },
        },
    });
    if (!category) {
        console.log(`Category with number ${categoryNumber} not found`);
        return {
            category: {
                id: 0,
                name: "",
                number: "",
            },
            thisYearBalance: 0,
            previousYearsBalance: 0,
        };
    }
    else {
        const totalBalance = yield calculateCategoryBalance(category.id);
        const thisYearBalance = totalBalance.thisYearReceived - totalBalance.thisYearSent;
        const previousYearsBalance = totalBalance.previousYearsReceived - totalBalance.previousYearsSent;
        return {
            category: {
                id: category.id,
                name: category.name,
                number: category.number,
            },
            thisYearBalance,
            previousYearsBalance,
        };
    }
});
exports.default = {
    getCategoryTransactionSummaryForAllCategories,
    getCategoryTransactionSummary,
    getCategoryStatistics,
    deleteCategory,
    updateCategory,
    getCategoryThatHaveAccounts,
    getCategoryByNumber,
    createCategory,
    getCategories,
    getCategoryById,
    getCategoriesBalances,
    getCategoryBalance,
    getCategoriesWithNums,
};
