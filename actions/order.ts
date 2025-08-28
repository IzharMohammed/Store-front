"use server";

import { ShippingAddress } from "@/types/auth-order";
import { OrdersResponse } from "@/types/order";
import { cookieManager } from "@/utils/authTools";
import { revalidateTag } from "next/cache";

const API_KEY = process.env.BACKEND_API_KEY || "";
const BACKEND_URL = process.env.BACKEND_URL || "";

export async function getOrders(): Promise<OrdersResponse> {
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
            `${BACKEND_URL}/v1/order`,
            {
                method: "GET",
                headers,
                cache: 'no-store', // Ensure fresh data on each request
                next: {
                    tags: ["orders"]
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

interface CreateOrderData {
    shippingAddress: ShippingAddress
    customerPhone?: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    total: number;
}

interface CreateOrderResponse {
    success: boolean;
    data?: {
        orderId: string;
        orderNumber: string;
        total: number;
        status: string;
    };
    message: string;
    error?: string;
}

export async function createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse> {
    // Check if environment variables are set
    if (!API_KEY || !BACKEND_URL) {
        console.error("Missing environment variables: BACKEND_API_KEY or BACKEND_URL");
        return {
            success: false,
            message: "Server configuration error. Please try again later."
        };
    }

    // Basic validation
    if (!orderData.items || orderData.items.length === 0) {
        return {
            success: false,
            message: "Customer email and order items are required"
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
            `${BACKEND_URL}/v1/order`,
            {
                method: "POST",
                headers,
                body: JSON.stringify(orderData),
                next: {
                    tags: ["orders", "cart"]
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create order");
        }

        const result = await response.json();

        // Revalidate both orders and cart tags since order creation affects both
        revalidateTag("orders");
        revalidateTag("cart");

        return {
            success: true,
            message: "Order placed successfully!",
        };

    } catch (error) {
        console.error("Error creating order:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create order"
        };
    }
}