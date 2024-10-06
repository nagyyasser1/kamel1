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
const userService_1 = __importDefault(require("../services/userService"));
const statusCodes_1 = require("../constants/statusCodes");
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, role } = req.query;
    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const users = yield userService_1.default.getAllUsers(pageNumber, limitNumber, role);
        res.status(statusCodes_1.STATUS_CODES.OK).json(users);
    }
    catch (error) {
        next(error);
    }
});
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService_1.default.getUserById(req.params.id);
        if (user) {
            res.status(statusCodes_1.STATUS_CODES.OK).json(user);
        }
        else {
            res.status(statusCodes_1.STATUS_CODES.NOT_FOUND).json({ error: "User not found" });
        }
    }
    catch (error) {
        next(error);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield userService_1.default.createUser(req.body);
        res.status(statusCodes_1.STATUS_CODES.CREATED).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userService_1.default.updateUser(req.params.id, req.body);
        res.status(statusCodes_1.STATUS_CODES.OK).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userService_1.default.deleteUser(req.params.id);
        res.status(statusCodes_1.STATUS_CODES.NO_CONTENT).send();
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
