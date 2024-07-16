"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = __importDefault(require("../controllers/profileController"));
const router = (0, express_1.Router)();
router.get("/", profileController_1.default.getAllProfiles);
router.get("/:id", profileController_1.default.getProfileById);
router.post("/", profileController_1.default.createProfile);
router.put("/:id", profileController_1.default.updateProfile);
router.delete("/:id", profileController_1.default.deleteProfile);
exports.default = router;
