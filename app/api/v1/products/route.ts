import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/v1/products`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.API_KEY!,
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// const API_KEY = process.env.API_KEY;
// const BACKEND_URL = process.env.BACKEND_URL;

// // GET - List products
// export async function GET(req: NextRequest) {
//     if (!API_KEY || !BACKEND_URL) {
//         return NextResponse.json(
//             { success: false, error: 'Server configuration error' },
//             { status: 500 }
//         );
//     }

//     try {
//         const { searchParams } = new URL(req.url);
//         const search = searchParams.get('search');
//         const category = searchParams.get('category');
//         const limit = searchParams.get('limit');
//         const offset = searchParams.get('offset');

//         // Build query parameters
//         const queryParams = new URLSearchParams();
//         if (search) queryParams.append('search', search);
//         if (category) queryParams.append('category', category);
//         if (limit) queryParams.append('limit', limit);
//         if (offset) queryParams.append('offset', offset);

//         const queryString = queryParams.toString();
//         const url = `${BACKEND_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`;

//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'x-api-key': API_KEY,
//                 'Content-Type': 'application/json',
//                 // Forward cookies and auth headers
//                 'Cookie': req.headers.get('cookie') || '',
//                 'Authorization': req.headers.get('authorization') || '',
//             },
//         });

//         const data = await response.json();
//         return NextResponse.json(data, { status: response.status });

//     } catch (error) {
//         console.error('Failed to fetch products:', error);
//         return NextResponse.json(
//             { success: false, error: 'Failed to fetch products' },
//             { status: 500 }
//         );
//     }
// }