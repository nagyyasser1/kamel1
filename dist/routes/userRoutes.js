"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.get("/", userController_1.default.getAllUsers);
router.get("/:id", userController_1.default.getUserById);
router.post("/", userController_1.default.createUser);
router.put("/:id", userController_1.default.updateUser);
router.delete("/:id", userController_1.default.deleteUser);
exports.default = router;
