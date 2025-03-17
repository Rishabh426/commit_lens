import axios from "axios";
import dotenv from "dotenv";
import { fetchFileContent } from "./services/fetchfilecontent";
import { storeCommit } from "./services/storeCode";

dotenv.config();

const OWNER = "Rishabh426";
const REPO = "test_repo";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

async function getLatestCommitChanges() {
    try {
        const commitUrl = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
        const commitResponse = await axios.get(commitUrl, {
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
        const changesResponse = await axios.get(changesUrl, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        const filesChanged = changesResponse.data.files;

        console.log("\n📝 Files Changed:");
        filesChanged.forEach((file: any) => {
            console.log(`- ${file.filename} (${file.status})`);
        });

        const fileContents = await Promise.all(
            filesChanged.map((file: any) => fetchFileContent(file.filename, commitSHA))
        );

        await storeCommit(commitSHA, fileContents);
        console.log("All commit files stored in neon DB");
        
    } catch (error: any) {
        console.error("Error fetching commit changes:", error.response?.data || error.message);
    }
}
getLatestCommitChanges();


