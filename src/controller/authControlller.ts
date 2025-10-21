import z from "zod";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sendResponse } from "../util/sendResponse";
import { getUserModel } from "../model/authModel";
import { generateToken } from "../util/generateToken";

const loginSchema = z.object({
    username    : z.string().min(5, "Username required minimum 5 characters"),
    password    : z.string().min(8, "Password required minimum 8 characters")
});

const signupSchema = z.object({
    username    : z.string().min(5, "Username required minimum 5 characters"),
    password    : z.string().min(8, "Password required minimum 8 characters")
})

export const authSignup = async (req: Request, res: Response) => {
    try{
        const { username, password } = signupSchema.parse(req.body);

        

    } catch (err: any) {
        console.error("Error in authSignup: ", err);


    }
}

export const authLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        const user = await getUserModel(username);
        if (!user) return sendResponse(res, 400, "Invalid", { message: "Invalid username or password" })

        const isPasswordValid = await bcrypt.compare(password, user.password || "");
        if (!isPasswordValid) return sendResponse(res, 400, "Invalid", { message: "Invalid username or password" })

        const { refreshToken, accessToken } = await generateToken(user.user_id, user.username);
        res
        .cookie("refreshToken", refreshToken, {
            httpOnly    : true,
            secure      : false,
            sameSite    : "strict",
            maxAge      : 7 * 24 * 60 * 60 * 1000
        })
        .cookie("accessToken", accessToken, {
            httpOnly    : true,
            secure      : false,
            sameSite    : "strict",
            maxAge      : 2 * 60 * 60 * 1000
        })

        return sendResponse(res, 200, "Success", { user_id: user.user_id, username: user.username, message: "Successfully logged in" })
    } catch (err: any) {
        console.error("Error in authLogin: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages })
        }

        return sendResponse(res, 500, "Failed to logged in", { error: "An unexpected server error occurred while logging in" })
    }
}