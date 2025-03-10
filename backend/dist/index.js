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
const fetchfilecontent_1 = require("./fetchfilecontent");
dotenv_1.default.config();
const owner = "Rishabh426";
const repo = "test_repo";
const githubToken = process.env.GITHUB_TOKEN;
function getLatestCommit() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
                params: { per_page: 1 },
            });
            if (response.data.length === 0) {
                console.log("No commits found");
                return null;
            }
            return response.data[0].sha;
        }
        catch (err) {
            console.log("ERROR IN FETCHING DATA", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return null;
        }
    });
}
function getChangedFiles(commitSha) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`, {
                headers: { Authorization: `Bearer ${githubToken}` },
            });
            if (!response.data.files || response.data.files.length === 0) {
                console.log("No files changed in this commit.");
                return [];
            }
            return response.data.files.map((file) => file.filename);
        }
        catch (err) {
            console.error("Error fetching commit changes:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return [];
        }
    });
}
function fetchChangedFilesContent() {
    return __awaiter(this, void 0, void 0, function* () {
        const commitSha = yield getLatestCommit();
        if (!commitSha)
            return;
        const changedFiles = yield getChangedFiles(commitSha);
        if (!changedFiles.length) {
            console.log("No files modified in this commit.");
            return;
        }
        console.log("Files modified:", changedFiles);
        const fileContents = yield Promise.all(changedFiles.map(fetchfilecontent_1.fetchfilecontent));
        fileContents.forEach(({ filePath, content }) => {
            if (content) {
                console.log(`\n📄 File: ${filePath}`);
                console.log("------------------------------------------------");
                console.log(content);
                console.log("------------------------------------------------");
            }
        });
        console.log("Fetched all modified files successfully!");
    });
}
function isRecentCommit() {
    return __awaiter(this, void 0, void 0, function* () {
        const commitSha = yield getLatestCommit();
        if (!commitSha)
            return false;
        const response = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`, {
            headers: { Authorization: `Bearer ${githubToken}` },
        });
        const commitTimestamp = response.data.commit.author.date;
        const commitTime = new Date(commitTimestamp).getTime();
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        return commitTime >= tenMinutesAgo;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const isRecent = yield isRecentCommit();
    if (isRecent) {
        console.log("✅ A recent commit was made in the last 10 minutes.");
        yield fetchChangedFilesContent();
    }
    else {
        console.log("No commit was made in the last 10 minutes.");
    }
}))();
