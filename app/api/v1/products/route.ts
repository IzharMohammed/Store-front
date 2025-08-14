import { NextRequest, NextResponse } from 'next/server';

// export async function GET() {
//     try {
//         const response = await fetch(
//             `${process.env.BACKEND_URL}/v1/products`, 
//             {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "x-api-key": process.env.API_KEY!,
//                 },
//             }
//         );

//         const data = await response.json();
//         return NextResponse.json(data);
//     } catch (error) {
//         return NextResponse.json(
//             { error: 'Failed to fetch products' },
//             { status: 500 }
//         );
//     }
// }

const API_KEY = process.env.BACKEND_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL;

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
        const url = `${BACKEND_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`;

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
