import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

        const body = await request.json();
        console.log("body", body);

        const response = await fetch(
            `${process.env.BACKEND_URL}/v1/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.API_KEY!,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        console.log("data", data);

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || "Signup failed...!!!" },
                { status: response.status }
            )
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}