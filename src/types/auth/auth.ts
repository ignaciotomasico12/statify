import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface ExtendedToken extends JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user?: Session["user"];
    error?: string;
}
export interface ExtendedSession extends Session {
    accessToken?: string;
    user?: Session["user"];
    error?: string;
}