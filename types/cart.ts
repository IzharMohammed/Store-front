export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    addedAt: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image?: string;
    };
}

export interface CartResponse {
    success: boolean;
    data: CartItem[];
    count: number;
    message: string;
}

export interface RemoveFromCartResponse {
    success: boolean;
    message: string;
}

