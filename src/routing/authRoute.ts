import { Router } from "express";
import { authLogin, authSignup } from "../controller/authControlller";

const authRouter = Router();

authRouter.post("/login", authLogin);
authRouter.post("/signup", authSignup);

export default authRouter;