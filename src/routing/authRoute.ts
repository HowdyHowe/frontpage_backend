import { Router } from "express";
import { authLogin } from "../controller/authControlller";

const authRouter = Router();

authRouter.post("/login", authLogin);

export default authRouter;