"use server"
import { CartResponse } from "@/types/auth-order";
import { cookieManager } from "@/utils/authTools";
import { revalidateTag } from "next/cache";

const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getCartItems(): Promise<CartResponse> {
    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
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
            `${BACKEND_URL}/v1/cart`,
            {
                method: "GET",
                headers,
                cache: 'no-store', // Ensure fresh data on each request
                next: {
                    tags: ["cart"]
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;

    }
}

interface AddToCartResponse {
    success: boolean;
    message: string;
}

export async function addToCart(
    productId: string,
    quantity: number
)
    : Promise<AddToCartResponse> {

    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        return {
            success: false,
            message: "Server configuration error. Please try again later."
        };
    }

    // Basic validation
    if (!productId || !quantity) {
        return {
            success: false,
            message: "Product ID and quantity are required"
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
            `${BACKEND_URL}/v1/cart`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({ productId, quantity }),
                next: {
                    tags: ["cart"]
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add item to cart");
        }

        revalidateTag("cart");
        return {
            success: true,
            message: "Item added to cart successfully...!!!"
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;

    }
}

export async function removeFromCart(cartId: string): Promise<void> {
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
            `${BACKEND_URL}/v1/cart`,
            {
                method: "DELETE",
                headers,
                body: JSON.stringify({ cartId }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to remove cart item");
        }

        revalidateTag('cart');

    } catch (error) {
        console.error("Remove from cart failed:", error);
        throw error;
    }
}

export async function updateCartQuantity(cartId: string, quantity: number): Promise<void> {
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
            `${BACKEND_URL}/v1/cart/update`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify({ cartId, quantity }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update cart items");
        }

        revalidateTag('cart');

    } catch (error) {
        console.error("Update cart failed:", error);
        throw error;
    }
}