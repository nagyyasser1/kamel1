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
const prisma_1 = __importDefault(require("../prisma"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const statusCodes_1 = require("../constants/statusCodes");
const getAllUsers = (page, limit, role) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const where = role ? { role: role } : {};
    return yield prisma_1.default.user.findMany({
        where,
        skip,
        take: limit,
    });
});
const countExistingUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.count();
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: { id },
    });
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
});
const getUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findFirst({
        where: { phone },
    });
});
const savePasswordResetToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.passwordReset.create({
        data: {
            userId,
            token,
            expiresAt: new Date(Date.now() + 3600000),
        },
    });
});
const verifyPasswordResetToken = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield prisma_1.default.passwordReset.findFirst({
        where: {
            userId,
            token,
            expiresAt: {
                gt: new Date(),
            },
        },
    });
    return !!record;
});
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: userData.email },
    });
    if (existingUser) {
        throw new CustomError_1.default("User already exists", statusCodes_1.STATUS_CODES.CONFLICT);
    }
    return yield prisma_1.default.user.create({
        data: userData,
    });
});
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id },
        data: userData,
    });
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserById(id);
    if (!user) {
        throw new Error("User not exists");
    }
    yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.passwordReset.deleteMany({
            where: { userId: id },
        });
        yield prisma.user.delete({
            where: { id },
        });
    }));
    return;
});
exports.default = {
    getAllUsers,
    countExistingUsers,
    getUserById,
    getUserByEmail,
    getUserByPhone,
    savePasswordResetToken,
    verifyPasswordResetToken,
    createUser,
    updateUser,
    deleteUser,
};
