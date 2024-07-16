"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = __importDefault(require("../controllers/postController"));
const router = (0, express_1.Router)();
router.get("/", postController_1.default.getAllPosts);
router.get("/:id", postController_1.default.getPostById);
router.post("/", postController_1.default.createPost);
router.put("/:id", postController_1.default.updatePost);
router.delete("/:id", postController_1.default.deletePost);
exports.default = router;
