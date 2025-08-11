import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/v1/order`,
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