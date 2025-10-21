import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routing/authRoute";

dotenv.config({quiet:true})

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(morgan((tokens, req, res) => {
  const log = ["🔵", tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens["response-time"](req, res), "ms"].join(" ")
  return null
}));

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});