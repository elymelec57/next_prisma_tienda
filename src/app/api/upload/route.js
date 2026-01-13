
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || 'upload.jpg';

    try {
        const blob = await put(filename, request.body, {
            access: 'public',
            addRandomSuffix: true,
        });

        return NextResponse.json({ status: true, url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ status: false, message: 'Error uploading file' }, { status: 500 });
    }
}
