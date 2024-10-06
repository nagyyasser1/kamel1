"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userValidators_1 = require("../utils/validations/userValidators");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeMiddleware_1 = __importDefault(require("../middlewares/authorizeMiddleware"));
const userRoles_1 = require("../constants/userRoles");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.default, (0, authorizeMiddleware_1.default)(userRoles_1.USER_ROLES.ADMIN));
router.get("/", userValidators_1.validateQueryUsers, userController_1.default.getAllUsers);
router.get("/:id", userController_1.default.getUserById);
router.post("/", userValidators_1.validateCreateUser, userController_1.default.createUser);
router.patch("/:id", userValidators_1.validateUpdateUser, userController_1.default.updateUser);
router.delete("/:id", userController_1.default.deleteUser);
exports.default = router;
