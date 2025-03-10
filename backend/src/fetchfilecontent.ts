import dotenv from "dotenv"
import axios from "axios"

dotenv.config();

const owner = "Rishabh426"
const repo = "test_repo"
const branch = "main";

export async function fetchfilecontent(filepath: string) {
    try {
        const fileExistsResponse = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`,
            { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
        );
        if (!fileExistsResponse.data) {
            console.log(`File not found in repo: ${filepath}`);
            return { filepath, content: null };
        }
        const fileURL = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filepath}`;
        const response = await axios.get(fileURL);
        return { filepath, content : response.data};
    } catch(err : any) {
        console.log("ERROR FETCHING THE DATA", err.message);
        return { filepath, content: null };
    }
}

