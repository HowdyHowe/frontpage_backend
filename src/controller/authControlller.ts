import z from "zod";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sendResponse } from "../util/sendResponse";
import { getUserModel } from "../model/authModel";

const loginSchema = z.object({
    username    : z.string().min(5, "Username required minimum 5 character"),
    password    : z.string().min(8, "Password required minimum 8 character")
});

export const authLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        const user = await getUserModel(username);
        const isPasswordValid = await bcrypt.compare(password, user.password || "");

        if (!isPasswordValid) return sendResponse(res, 400, "Invalid", { message: "Invalid username or password" })

    } catch (err: any) {
        console.error("Error in authenticationController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }

        return sendResponse(res, 500, "Failed to logged in", { error: "An unexpected server error occurred while logging in" });
    }
}