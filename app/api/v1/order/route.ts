import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.API_KEY;
const BACKEND_URL = process.env.BACKEND_URL;

// GET - List orders
export async function GET(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${BACKEND_URL}/v1/order`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                // Forward cookies and auth headers
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST - Create order
export async function POST(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const orderData = await req.json();

        const response = await fetch(`${BACKEND_URL}/api/v1/order`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                // Forward cookies and auth headers
                'Cookie': req.headers.get('cookie') || '',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });

    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}