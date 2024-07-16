"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Your API Documentation",
            version: "1.0.0",
            description: "API Documentation for your application",
        },
        servers: [
            {
                url: "http://localhost:3000", // Update the URL accordingly
                description: "Development Server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Update the path to your route files
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
