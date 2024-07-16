"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const profileRoutes_1 = __importDefault(require("./profileRoutes"));
const router = (0, express_1.Router)();
router.use("/users", userRoutes_1.default);
router.use("/posts", postRoutes_1.default);
router.use("/profiles", profileRoutes_1.default);
exports.default = router;
