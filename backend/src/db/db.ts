import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    connectionString: "postgresql://postgres:Rishabh1234@db.ejjnljgrvekvchokahif.supabase.co:5432/postgres",
});


