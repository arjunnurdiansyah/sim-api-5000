import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db_sim.js";
import router from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database Connected...");
} catch (error) {
  console.error(error);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__basedir = __dirname;
// app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(
  cors({
    credentials: true,
    allowedHeaders: "*",
    allowedOrigins: "*",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () =>
  console.log("Server running at port 5000", global.__basedir)
);
