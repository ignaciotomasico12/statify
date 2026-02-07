import { getCurrentUserProfile } from "@/services/users";
import { ExtendedSession, ExtendedToken, ExtendedUser } from "@/types/auth";
import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

async function refreshAccessToken(token: ExtendedToken): Promise<ExtendedToken> {
    try {
        const url = "https://accounts.spotify.com/api/token";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
                ).toString("base64")}`,
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        SpotifyProvider({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            authorization: {
                url: "https://accounts.spotify.com/authorize",
                params: {
                    scope: "user-read-email user-read-private user-top-read user-follow-modify user-follow-read user-library-read user-read-recently-played playlist-read-private",
                },
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, user }) {
            let extendedToken: ExtendedToken = token as ExtendedToken;
            if (account && user) {
                extendedToken = {
                    accessToken: account.access_token!,
                    refreshToken: account.refresh_token!,
                    accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
                    user: user as unknown as ExtendedUser // Type cast to satisfy ExtendedUser requirement during initial login
                };
                return extendedToken;
            }

            if (Date.now() < extendedToken.accessTokenExpires) {
                return extendedToken;
            }
            return await refreshAccessToken(extendedToken);
        },
        async session({ session, token }) {
            const extendedToken = token as ExtendedToken;
            const userProfile = await getCurrentUserProfile(extendedToken.accessToken as string)
            const extendedSession: ExtendedSession = {
                ...session,
                accessToken: extendedToken.accessToken,
                error: extendedToken.error,
                user: {
                    ...extendedToken.user,
                    locale: userProfile.country.toLowerCase(),
                    id: userProfile.id,
                    displayName: userProfile.display_name,
                    email: userProfile.email,
                    followers: userProfile.followers,
                    spotifyUrl: userProfile.external_urls.spotify,
                    accountType: userProfile.product,
                }
            };
            return extendedSession as ExtendedSession;
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        }
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signin",
    }
};
