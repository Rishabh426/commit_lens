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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fetchfilecontent_1 = require("./services/fetchfilecontent");
const storeCode_1 = require("./services/storeCode");
dotenv_1.default.config();
const OWNER = "Rishabh426";
const REPO = "test_repo";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
function getLatestCommitChanges() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const commitUrl = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
            const commitResponse = yield axios_1.default.get(commitUrl, {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            });
            if (!commitResponse.data.length) {
                console.log("No commits found.");
                return;
            }
            const latestCommit = commitResponse.data[0];
            const commitSHA = latestCommit.sha;
            console.log("🔹 Latest Commit SHA:", commitSHA);
            const changesUrl = `https://api.github.com/repos/${OWNER}/${REPO}/commits/${commitSHA}`;
            const changesResponse = yield axios_1.default.get(changesUrl, {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            });
            const filesChanged = changesResponse.data.files;
            console.log("\nFiles Changed:");
            filesChanged.forEach((file) => {
                console.log(`- ${file.filename} (${file.status})`);
            });
            const fileContents = yield Promise.all(filesChanged.map((file) => (0, fetchfilecontent_1.fetchFileContent)(file.filename, commitSHA)));
            yield (0, storeCode_1.storeCommit)(commitSHA, fileContents);
            console.log("All commit files stored in neon DB");
        }
        catch (error) {
            console.error("Error fetching commit changes:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
getLatestCommitChanges();
