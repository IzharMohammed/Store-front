import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_KEY || !BACKEND_URL) {
    console.error('Missing required environment variables: BACKEND_API_KEY or BACKEND_URL');
}

export async function GET(req: NextRequest) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { searchParams } = new URL(req.url);

        // Forward query parameters if any
        const queryString = searchParams.toString();
        const url = `${BACKEND_URL}/v1/products${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
                // Forward cookies from the client request
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
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch products',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}
