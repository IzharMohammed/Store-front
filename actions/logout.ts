"use server";

import { cookieManager } from "@/utils/authTools"; // Update with correct path
import { redirect } from "next/navigation";

export async function logoutAction() {
    try {
        await cookieManager.clearAuthCookies();
    } catch (error) {
        console.error("Error clearing cookies:", error);
    }

    // Redirect to home page after logout
    redirect("/");
}