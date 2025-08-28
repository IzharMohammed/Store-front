"use server";

import { cookieManager } from "@/utils/authTools";

const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getProducts() {
    try {
        const userData = await cookieManager.getAuthUser();
        console.log("userData", userData);

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-customer-id"] = userData.id;
            console.log("Setting x-customer-id to:", userData.id);
        }
        console.log("Final headers being sent:", headers);
        console.log("Request URL:", `${BACKEND_URL}/v1/products`);

        const response = await fetch(
            `${BACKEND_URL}/v1/products`,
            {
                method: "GET",
                headers,
                cache: 'no-store', // Ensure fresh data on each request
                next: {
                    tags: ["products"]
                }
            }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error("Failed to fetch cart items");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;

    }
}