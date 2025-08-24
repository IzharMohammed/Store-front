export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    product?: {
        id: string;
        name: string;
        image?: string;
        price: number;
    };
}

export interface Order {
    id: string;
    customerId: string;
    customerEmail: string;
    customerName?: string;
    customerPhone?: string;
    total: number;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    shippingAddress:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    billingAddress?:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    items: OrderItem[];
    storeId: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrdersResponse {
    success: boolean;
    data: Order[];
    count: number;
    message: string;
}