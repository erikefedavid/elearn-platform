// POST /api/upload — Upload file to Cloudinary (instructor only)
import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'instructor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — instructor only' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'eduadapt';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine resource type
    const mimeType = file.type;
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (mimeType.startsWith('image/')) resourceType = 'image';
    else if (mimeType.startsWith('video/')) resourceType = 'video';

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
