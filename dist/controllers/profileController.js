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
const profileService_1 = __importDefault(require("../services/profileService"));
const getAllProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield profileService_1.default.getAllProfiles();
        res.status(200).json(profiles);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield profileService_1.default.getProfileById(Number(req.params.id));
        if (profile) {
            res.status(200).json(profile);
        }
        else {
            res.status(404).json({ error: "Profile not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProfile = yield profileService_1.default.createProfile(req.body);
        res.status(201).json(newProfile);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProfile = yield profileService_1.default.updateProfile(Number(req.params.id), req.body);
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield profileService_1.default.deleteProfile(Number(req.params.id));
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
};
