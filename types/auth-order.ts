export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
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

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderResponse {
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