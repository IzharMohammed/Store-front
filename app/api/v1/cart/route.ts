import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_KEY || !BACKEND_URL) {
    console.error('Missing required environment variables: BACKEND_API_KEY or BACKEND_URL');
}

// Helper function to build headers
const buildHeaders = (req: NextRequest) => {
    const headers: Record<string, string> = {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
    };

    // Forward ALL cookies (for Better Auth session)
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
        headers['Cookie'] = cookieHeader;
    }

    const userIdHeader = req.headers.get('x-user-id');

    if (userIdHeader) headers['x-user-id'] = userIdHeader;

    return headers;
};

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
            headers: buildHeaders(req),
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
