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
const postService_1 = __importDefault(require("../services/postService"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postService_1.default.getAllPosts();
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield postService_1.default.getPostById(Number(req.params.id));
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ error: "Post not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = yield postService_1.default.createPost(req.body);
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield postService_1.default.updatePost(Number(req.params.id), req.body);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postService_1.default.deletePost(Number(req.params.id));
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
