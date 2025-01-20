import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";


export interface ExtendedUser extends User {
    locale: string;
    id: string;
    displayName: string;
    email: string;
    followers: {
        href: string | null;
        total: number;
    };
    spotifyUrl: string;
    accountType: string;
}

export interface ExtendedToken extends JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user?: ExtendedUser;
    error?: string;
}

export interface ExtendedSession extends Session {
    accessToken?: string;
    user?: ExtendedUser;
    error?: string;
}