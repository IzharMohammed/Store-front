"use server";

import { WishlistResponse } from "@/types/wishlist";
import { cookieManager } from "@/utils/authTools";
import { revalidateTag } from "next/cache";

const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getWishlistItems(): Promise<WishlistResponse> {
    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        throw new Error("Server configuration error");
    }

    try {
        const userData = await cookieManager.getAuthUser();

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-customer-id"] = userData.id;
        }

        const response = await fetch(
            `${BACKEND_URL}/v1/wishlist`,
            {
                method: "GET",
                headers,
                cache: 'no-store', // Ensure fresh data on each request
                next: {
                    tags: ["wishlist"]
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch wishlist items");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

interface AddToWishlistResponse {
    success: boolean;
    message: string;
}

export async function addToWishlist(productId: string): Promise<AddToWishlistResponse> {
    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        return {
            success: false,
            message: "Server configuration error. Please try again later."
        };
    }

    // Basic validation
    if (!productId) {
        return {
            success: false,
            message: "Product ID is required"
        };
    }

    try {
        const userData = await cookieManager.getAuthUser();

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-customer-id"] = userData.id;
        }

        const response = await fetch(
            `${BACKEND_URL}/v1/wishlist`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({ productId }),
                next: {
                    tags: ["wishlist"]
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add to wishlist");
        }

        revalidateTag("wishlist");
        return {
            success: true,
            message: "Item added to wishlist successfully!"
        };
    } catch (error) {
        console.error("Error adding to wishlist:", error);

        if (error instanceof Error && error.message.includes("already in wishlist")) {
            return {
                success: false,
                message: "Item is already in your wishlist"
            };
        }

        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to add to wishlist"
        };
    }
}

interface RemoveFromWishlistResponse {
    success: boolean;
    message: string;
}

export async function removeFromWishlist(itemId: string): Promise<RemoveFromWishlistResponse> {
    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        return {
            success: false,
            message: "Server configuration error. Please try again later."
        };
    }

    // Basic validation
    if (!itemId) {
        return {
            success: false,
            message: "Item ID is required"
        };
    }

    try {
        const userData = await cookieManager.getAuthUser();

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };

        // Add custom headers if user is authenticated
        if (userData) {
            headers["x-customer-id"] = userData.id;
        }

        const response = await fetch(
            `${BACKEND_URL}/v1/wishlist/${itemId}`,
            {
                method: "DELETE",
                headers,
                next: {
                    tags: ["wishlist"]
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove from wishlist");
        }

        revalidateTag("wishlist");
        return {
            success: true,
            message: "Item removed from wishlist successfully!"
        };
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to remove from wishlist"
        };
    }
}