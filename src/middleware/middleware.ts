import jwt, { TokenExpiredError } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../util/sendResponse";
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../util/generateToken";

interface PayloadData extends JwtPayload {
    user_id     : string,
    username    : string,
}

declare global {
    namespace Express {
        interface Request {
            user?: PayloadData;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const curAccessToken        = req.cookies.accessToken;
    const curRefreshToken       = req.cookies.refreshToken;
    const accessTokenSecret     = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret    = process.env.JWT_REFRESH_SECRET;

    let payloadAccess : PayloadData;
    let payloadRefresh: PayloadData;

    if (!accessTokenSecret || !refreshTokenSecret) return sendResponse(res, 500, "Error", { message: "Server configuration error." })
    if (!curAccessToken) return sendResponse(res, 401, "Credential required", { message: "Access token required." })
    if (!curRefreshToken) return sendResponse(res, 401, "Credential required", { message: "Refresh token required." })

    // refresh token verification
    try {
        payloadRefresh = jwt.verify(curRefreshToken, refreshTokenSecret) as unknown as PayloadData;
    } catch (err: any) {
        console.error("Refresh Token Error: ", err);

        if (err instanceof TokenExpiredError) {
            res
            .cookie("accessToken", "", {
                httpOnly: true,
                secure  : false,
                sameSite: "strict",
                maxAge  : 0
            })
            .cookie("refreshToken", "", {
                httpOnly: true,
                secure  : false,
                sameSite: "strict",
                maxAge  : 0
            })

            return sendResponse(res, 401, "Credential expired", { message: "Refresh token is expired." })
        }

        return sendResponse(res, 401, "Credential invalid", { message: "Refresh token is invalid." })
    }

    // access token verification
    try {
        payloadAccess = jwt.verify(curAccessToken, accessTokenSecret) as unknown as PayloadData;
        if (payloadAccess.user_id !== payloadRefresh.user_id) return sendResponse(res, 403, "Credential mismatch", { message: "Token mismatch" })

        req.user = payloadAccess;
        return next()
    } catch (err: any) {
        console.error("Access token error: ", err);

        if (err instanceof TokenExpiredError) {
            try {
                const { accessToken } = await generateToken(payloadRefresh.user_id, payloadRefresh.username);

                res
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure  : false,
                    sameSite: "strict",
                    maxAge  : 2 * 60 * 60 * 1000
                })

                return next();
            } catch (err: any) {
                console.error("Error: ", err);

                return sendResponse(res, 500, "Failed", { message: "Failed to generate token." })
            }
        }

        console.error("Error: ", err);
        return sendResponse(res, 401, "Credential Invalid", { message: "Access token is invalid." })
    }
}
