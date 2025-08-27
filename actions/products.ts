"use server";

import { cookieManager } from "@/utils/authTools";

const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getProducts() {
    try {
        const userData = await cookieManager.getAuthUser();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-user-id"] = userData.id;
        }

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

        if (!response.ok) {
            console.log("Failed to fetch cart items");
        }

        return response.json();
    } catch (error) {
        console.log("Error fetching cart:", error);
        throw error;

    }
}


export async function getProductDetails(productId: string) {
    try {
        const userData = await cookieManager.getAuthUser();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-user-id"] = userData.id;
        }

        console.log("  BACKENDURL = ", process.env.BACKEND_URL);

        console.log("Fetching from backend:", `${BACKEND_URL}/v1/products/${productId}`);
        const response = await fetch(
            `${BACKEND_URL}/v1/product/${productId}`,
            {
                method: "GET",
                headers,
                cache: 'no-store', // Ensure fresh data on each request
                next: {
                    tags: ["products"]
                }
            }
        );
        console.log("product details RESPONSE DATA", response);

        if (!response.ok) {
            console.log("Failed to fetch cart items");
        }

        return response.json();
    } catch (error) {
        console.log("Error fetching product  details:", error);
        // throw error;

    }

}