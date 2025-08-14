import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_KEY || !BACKEND_URL) {
    console.error('Missing required environment variables: BACKEND_API_KEY or BACKEND_URL');
}

// GET - Fetch cart items
export async function GET(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${BACKEND_URL}/v1/cart`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Failed to fetch cart items:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch cart items',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const cartData = await req.json();
        console.log("cartData", cartData);

        // Validate required fields
        if (!cartData.productId || !cartData.quantity || cartData.quantity <= 0) {
            return NextResponse.json(
                { success: false, message: 'Missing required cart data' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/v1/cart`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
            },
            body: JSON.stringify(cartData)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Failed to add to cart:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to add to cart',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { cartId } = await req.json();

        if (!cartId) {
            return NextResponse.json(
                { success: false, message: 'Cart ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/v1/cart`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || '',
            },
            body: JSON.stringify({ cartId })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Failed to remove from cart:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to remove from cart',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}