import { cookies } from 'next/headers';
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
                    // Forward any existing cookies from the client
                    // 'Cookie': request.headers.get('cookie') || ''
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

        // Create response
        const nextResponse = NextResponse.json(data, { status: 200 });

        // CRUCIAL: Forward all Set-Cookie headers from Better Auth backend to client
        // const setCookieHeaders = response.headers.getSetCookie();
        // if (setCookieHeaders.length > 0) {
        //     setCookieHeaders.forEach(cookie => {
        //         nextResponse.headers.append('Set-Cookie', cookie);
        //     });
        // }
        // const setCookieHeader = response.headers.get("set-cookie");
        // if (setCookieHeader) {
        //     // parse cookie components, then:
        //     (await cookies()).set({
        //         name: "izhar",
        //         value: "izhar",
        //         httpOnly: true,
        //         path: "/",
        //         sameSite: "none",
        //         secure: true
        //     });
        // }
        // console.log("nextResponse", nextResponse);
        // console.log("setCookieHeaders", setCookieHeader);

        return nextResponse;
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