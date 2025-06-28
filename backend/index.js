import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./src/config/dbConfig.js";
import authRoutes from "./src/routes/authRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;


connectDb();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});