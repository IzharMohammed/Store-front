"use server";

import { cookieManager } from "@/utils/authTools";
import { redirect } from "next/navigation";


const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

interface SigninFormData {
    email: string;
    password: string;
}

interface SigninResponse {
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export type SigninState = {
    success: boolean;
    error: string | null;
    message?: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
};

export async function signin(
    prevState: SigninState,
    formData: FormData
): Promise<SigninState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic validation
    if (!email || !password) {
        return {
            success: false,
            error: "All fields are required",
        };
    }

    if (!email.includes("@") || !email.includes(".")) {
        return {
            success: false,
            error: "Please enter a valid email address",
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters long",
        };
    }

    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        return {
            success: false,
            error: "Server configuration error. Please try again later.",
        };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/v1/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            body: JSON.stringify({ email, password }),
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || `Server error: ${response.status}. Please try again.`,
            };
        }

        const data: SigninResponse = await response.json();

        // Set authentication cookies
        await cookieManager.setAuthenticatedUser(data);

        return {
            success: true,
            error: null,
            message: data.message,
            user: data.user,
        };
    } catch (error) {
        console.error("Signin error:", error);
        return {
            success: false,
            error: "Network error. Please check your connection and try again.",
        };
    }
}

export async function redirectToSignup() {
    redirect("/signup");
}

export async function redireactToLandingPage() {
    redirect("/");
}