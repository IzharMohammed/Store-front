import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_KEY || !BACKEND_URL) {
    console.error('Missing required environment variables: BACKEND_API_KEY or BACKEND_URL');
}

// GET - Fetch orders
export async function GET(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${BACKEND_URL}/v1/order`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                // Forward cookies from the client request (important for session management)
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
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch orders',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const orderData = await req.json();
        console.log("orderData", orderData);

        // Validate required fields
        if (!orderData.customerEmail || !orderData.customerName || !orderData.items || orderData.items.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Missing required order data' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/v1/order`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                // Forward cookies from the client request (important for session management)
                'Cookie': req.headers.get('cookie') || '',
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create order',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}