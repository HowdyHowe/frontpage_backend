import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendResponse } from "./sendResponse";

dotenv.config({quiet: true})

export const generateToken = async (user_id: string, username: string) => {
    try {
        const accessSecret  = process.env.JWT_ACCESS_SECRET;
        const refreshSecret  = process.env.JWT_REFRESH_SECRET;

        if(!accessSecret || !refreshSecret) throw new Error("JWT secret key is not defined on environtment variable.")

        const accessToken = jwt.sign(
            { user_id: user_id, username: username },
            accessSecret,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { user_id: user_id, username: username },
            refreshSecret,
            { expiresIn: "7d" }
        )

        return { accessToken, refreshToken }
    } catch (err: any) {
        console.error("Error in generateToken", err)
    }
}