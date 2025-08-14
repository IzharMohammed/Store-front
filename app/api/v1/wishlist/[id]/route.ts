import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// DELETE - Remove from wishlist
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    if (!API_KEY || !BACKEND_URL) {
        return NextResponse.json(
            { success: false, message: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Wishlist item ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/v1/wishlist/${id}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
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
        console.error('Failed to remove from wishlist:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to remove from wishlist',
                error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            },
            { status: 500 }
        );
    }
}