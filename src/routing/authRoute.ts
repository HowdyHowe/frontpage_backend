import { Router } from "express";
import { authLogin, authLogout, authSignup } from "../controller/authControlller";

const authRouter = Router();

authRouter.post("/login", authLogin);
authRouter.post("/signup", authSignup);
authRouter.get("/logout", authLogout)

export default authRouter;