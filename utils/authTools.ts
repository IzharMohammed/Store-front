import "server-only";
import { cookies } from 'next/headers';

interface AuthUser {
    id: string;
    email: string;
    name: string;
}

interface LoginResponse {
    message: string;
    token: string;
    user: AuthUser;
}

class CookieManager {
    private readonly AUTH_TOKEN_KEY = "auth_token";
    private readonly USER_DATA_KEY = "user_data";

    async setAuthenticatedUser(loginResponse: LoginResponse): Promise<void> {
        const cookieStore = await cookies();

        // Set token cookie with security options
        cookieStore.set(this.AUTH_TOKEN_KEY, loginResponse.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        // Set user data cookie
        cookieStore.set(this.USER_DATA_KEY, JSON.stringify(loginResponse.user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
    }

    async getAuthUser(): Promise<AuthUser | null> {
        const cookieStore = await cookies();
        const userData = cookieStore.get(this.USER_DATA_KEY);

        if (!userData?.value) {
            return null;
        }

        try {
            // Decode the URL-encoded value first
            const decodedValue = decodeURIComponent(userData.value);
            return JSON.parse(decodedValue) as AuthUser;
        } catch (error) {
            console.error('Error parsing user data from cookie:', error);
            return null;
        }
    }

    async getAuthToken(): Promise<string | null> {
        const cookieStore = await cookies();
        const token = cookieStore.get(this.AUTH_TOKEN_KEY);
        return token?.value || null;
    }

    async clearAuthCookies(): Promise<void> {
        const cookieStore = await cookies();
        cookieStore.delete(this.AUTH_TOKEN_KEY);
        cookieStore.delete(this.USER_DATA_KEY);
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.getAuthToken();
        const user = await this.getAuthUser();
        return !!(token && user);
    }

}

export const cookieManager = new CookieManager();