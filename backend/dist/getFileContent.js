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
exports.fetchfilecontent = fetchfilecontent;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const owner = "Rishabh426";
const repo = "test_repo";
const branch = "main";
function fetchfilecontent(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileExistsResponse = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`, { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } });
            if (!fileExistsResponse.data) {
                console.log(`File not found in repo: ${filepath}`);
                return { filepath, content: null };
            }
            const fileURL = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filepath}`;
            const response = yield axios_1.default.get(fileURL);
            return { filepath, content: response.data };
        }
        catch (err) {
            console.log("ERROR FETCHING THE DATA", err.message);
            return { filepath, content: null };
        }
    });
}
