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
            headers["x-customer-id"] = userData.id;
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
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || `Server error: ${response.status}. Please try again.`,
            };
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching cart:", error);
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

        const response = await fetch(
            `${BACKEND_URL}/v1/products/${productId}`,
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
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: errorData.message || `Server error: ${response.status}. Please try again.`,
            };
        }

        return response.json();
    } catch (error) {
        console.log("Error fetching product  details:", error);
        throw error;
    }

}

export async function getPaginatedProducts(page: number, limit: number, category?:string) {

    try {

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
        };


        const response = await fetch(
            `${BACKEND_URL}/v1/products?page=${page}&limit=${limit}?category=${category}`,
            {
                method: "GET",
                headers,
                cache: 'no-store',
                next: {
                    tags: ["products"]
                }
            }
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                items: [],
                totalPages: 1,
                error: errorData.message || `Server error: ${response.status}. Please try again.`,
            };
        }

        const data = await response.json();
        const totalPages = Math.ceil(data.totalProducts / limit);


        return {
            success: true,
            items: data.items,
            totalProducts: data.totalProducts,
            error: undefined,
        };


    } catch (error: any) {
        console.error("Error fetching products:", error);
        return {
            success: false,
            items: [],
            totalPages: 1,
            error: error.message || "Unknown error occurred",
        };
    }

}