import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_KEY || !BACKEND_URL) {
    console.error('Missing required environment variables: NEXT_PUBLIC_BACKEND_API_KEY or NEXT_PUBLIC_BACKEND_URL');
}

export async function POST(request: Request) {

    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        console.log("body", body);

        const response = await fetch(
            `${BACKEND_URL}/v1/signin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        console.log("data", data);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null); // Gracefully handle if response is not JSON
            console.error(`Backend error: ${response.status} ${response.statusText}`, errorData);

            return NextResponse.json(
                { error: data.message || "Signin failed...!!!" },
                { status: response.status }
            )
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to process signin',
                error: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}