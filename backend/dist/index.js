"use strict";
// import axios from "axios";
// import dotenv from "dotenv";
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
// dotenv.config();
// const owner = "Rishabh426";
// const repo = "test_repo";
// const githubToken = process.env.GITHUB_TOKEN;
// async function getLatestCommit(): Promise<string | null> {
//     try {
//         const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
//             headers: {
//                 Authorization: `Bearer ${githubToken}`,
//                 Accept: "application/vnd.github.v3+json",
//             },
//             params: { per_page: 1 },
//         });
//         if (response.data.length === 0) {
//             console.log("No commits found");
//             return null;
//         }
//         return response.data[0].sha;
//     } catch (err: any) {
//         console.log("ERROR IN FETCHING DATA", err.response?.data || err.message);
//         return null;
//     }
// }
// async function getChangedFiles(commitSha: string) {
//     try {
//         const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`, {
//             headers: { Authorization: `Bearer ${githubToken}` },
//         });
//         if (!response.data.files || response.data.files.length === 0) {
//             console.log("No files changed in this commit.");
//             return [];
//         }
//         return response.data.files.map((file: any) => file.filename);
//     } catch (err: any) {
//         console.error("Error fetching commit changes:", err.response?.data || err.message);
//         return [];
//     }
// }
// async function fetchChangedFilesContent() {
//     const commitSha = await getLatestCommit();
//     if (!commitSha) return;
//     const changedFiles = await getChangedFiles(commitSha);
//     if (!changedFiles.length) {
//         console.log("No files modified in this commit.");
//         return;
//     }
//     console.log("Files modified:", changedFiles);
//     const fileContents = await Promise.all(changedFiles.map(fetchfilecontent));
//     fileContents.forEach(({ filePath, content }) => {
//         if (content) {
//             console.log(`\n📄 File: ${filePath}`);
//             console.log("------------------------------------------------");
//             console.log(content);
//             console.log("------------------------------------------------");
//         }
//     });
//     console.log("Fetched all modified files successfully!");
// }
// async function isRecentCommit() {
//     const commitSha = await getLatestCommit();
//     if (!commitSha) return false;
//     const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`, {
//         headers: { Authorization: `Bearer ${githubToken}` },
//     });
//     const commitTimestamp = response.data.commit.author.date;
//     const commitTime = new Date(commitTimestamp).getTime();
//     const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
//     return commitTime >= tenMinutesAgo;
// }
// (async () => {
//     const isRecent = await isRecentCommit();
//     if (isRecent) {
//         console.log("✅ A recent commit was made in the last 10 minutes.");
//         await fetchChangedFilesContent();
//     } else {
//         console.log("No commit was made in the last 10 minutes.");
//     }
// })();
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();
// const OWNER = "Rishabh426";
// const REPO = "test_repo";
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
// async function getLatestCommitChanges() {
//     try {
//         const commitUrl = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
//         const commitResponse = await axios.get(commitUrl, {
//             headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
//         });
//         if (!commitResponse.data.length) {
//             console.log("❌ No commits found.");
//             return;
//         }
//         const latestCommit = commitResponse.data[0];
//         const commitSHA = latestCommit.sha;
//         console.log("🔹 Latest Commit SHA:", commitSHA);
//         const changesUrl = `https://api.github.com/repos/${OWNER}/${REPO}/commits/${commitSHA}`;
//         const changesResponse = await axios.get(changesUrl, {
//             headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
//         });
//         const filesChanged = changesResponse.data.files;
//         console.log("\n📝 Files Changed:");
//         filesChanged.forEach((file: any) => {
//             console.log(`- ${file.filename} (${file.status})`);
//         });
//         return filesChanged;
//     } catch (error: any) {
//         console.error("❌ Error fetching commit changes:", error.response?.data || error.message);
//     }
// }
// getLatestCommitChanges();
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fetchfilecontent_1 = require("./services/fetchfilecontent");
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
                console.log("❌ No commits found.");
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
            console.log("\n📝 Files Changed:");
            filesChanged.forEach((file) => {
                console.log(`- ${file.filename} (${file.status})`);
            });
            const fileContents = yield Promise.all(filesChanged.map((file) => (0, fetchfilecontent_1.fetchFileContent)(file.filename, commitSHA)));
            fileContents.forEach(({ filePath, content }) => {
                console.log(`\n📄 File: ${filePath}`);
                console.log("------------------------------------------------");
                console.log(content);
                console.log("------------------------------------------------");
            });
            return fileContents;
        }
        catch (error) {
            console.error("Error fetching commit changes:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
getLatestCommitChanges();
