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
const getAllProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.findMany();
});
const getProfileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.findUnique({
        where: { id },
        include: { user: true },
    });
});
const createProfile = (profileData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.create({
        data: profileData,
    });
});
const updateProfile = (id, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.update({
        where: { id },
        data: profileData,
    });
});
const deleteProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.profile.delete({
        where: { id },
    });
});
exports.default = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
};
