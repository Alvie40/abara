import { AuthOptions, Session, User, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

// Extend the built-in session type
interface ExtendedSession extends Session {
    user: {
        id: string;
        email: string;
        name: string;
        is_admin: boolean;
    } & DefaultSession["user"];
    access: string;
    refresh: string;
}

// Extend the built-in user type
interface ExtendedUser extends User {
    id: string;
    email: string;
    name: string;
    is_admin: boolean;
    access: string;
    refresh: string;
}

interface DecodedJWT {
    id: number;
    email: string;
    is_admin: boolean;
    name: string;
    exp: number;
}

async function customAuthenticationFunction(credentials: any) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error during authentication:", error);
        return null;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<ExtendedUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const result = await customAuthenticationFunction(credentials);

                if (result) {
                    const decoded: DecodedJWT = jwtDecode(result.access);
                    
                    return {
                        id: decoded.id.toString(),
                        email: decoded.email,
                        name: decoded.name,
                        is_admin: decoded.is_admin,
                        access: result.access,
                        refresh: result.refresh,
                    } as ExtendedUser;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const extendedUser = user as ExtendedUser;
                token.user = {
                    id: extendedUser.id,
                    email: extendedUser.email,
                    name: extendedUser.name,
                    is_admin: extendedUser.is_admin
                };
                token.access = extendedUser.access;
                token.refresh = extendedUser.refresh;
            }
            return token;
        },
        async session({ session, token }): Promise<ExtendedSession> {
            if (token) {
                session.user = token.user;
                session.access = token.access;
                session.refresh = token.refresh;
            }
            return session as ExtendedSession;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day
    },
    secret: process.env.NEXTAUTH_SECRET,
}