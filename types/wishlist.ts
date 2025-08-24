export interface WishlistItem {
    id: string;
    productId: string;
    customerId?: string;
    sessionId?: string;
    createdAt: string;
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
        description?: string;
        category: string;
        stock: number;
    };
}

export interface WishlistCardProps {
    item: WishlistItem;
    onRemove: (id: string) => void;
    onAddToCart: (product: WishlistItem["product"]) => void;
    isRemoving: boolean;
}

export interface OrderSummaryProps {
    items: WishlistItem[];
    itemCount: number;
}

export interface RemoveFromWishlistResponse {
    success: boolean;
    message: string;
}

export interface WishlistResponse {
    success: boolean;
    data: WishlistItem[];
    count: number;
    message: string;
}