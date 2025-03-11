import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OWNER = "Rishabh426";
const REPO = "test_repo";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

export async function fetchFileContent(filePath: string, commitSHA: string) {
    try {
        const fileApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${commitSHA}`;

        const response = await axios.get(fileApiUrl, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
        const fileContent = Buffer.from(response.data.content, "base64").toString("utf-8");

        return { filePath, content: fileContent };
    } catch (error: any) {
        console.error(`ERROR FETCHING FILE ${filePath}:`, error.response?.data || error.message);
        return { filePath, content: null };
    }
}
