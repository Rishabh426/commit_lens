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
exports.fetchFileContent = fetchFileContent;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
dotenv_1.default.config();
const OWNER = "Rishabh426";
const REPO = "test_repo";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
function fetchFileContent(filePath, commitSHA) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const fileApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${commitSHA}`;
            const response = yield axios_1.default.get(fileApiUrl, {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            });
            const fileContent = Buffer.from(response.data.content, "base64").toString("utf-8");
            yield prismaClient_1.default.file.create({
                data: {
                    commitSha: commitSHA,
                    fileName: filePath,
                    content: fileContent,
                },
            });
            console.log(`Stored ${filePath} (Commit: ${commitSHA})`);
            return { fileName: filePath, content: fileContent };
        }
        catch (error) {
            console.error(`ERROR FETCHING FILE ${filePath}:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return { filePath, content: null };
        }
    });
}
