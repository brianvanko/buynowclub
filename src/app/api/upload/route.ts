import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'thumb' or 'lg'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Create unique filename (force .jpg extension)
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '');
    const filename = `${timestamp}-${originalName}.jpg`;

    // Determine upload directory based on type
    const uploadDir = type === 'thumb'
      ? path.join(process.cwd(), 'public', 'images', 'thumb')
      : path.join(process.cwd(), 'public', 'images', 'lg');

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);

    // Optimize and resize image with sharp
    let processedImage = sharp(buffer);

    if (type === 'thumb') {
      // Thumbnails: resize to max 400x400, maintain aspect ratio
      processedImage = processedImage.resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    } else {
      // Large images: resize to max 1200x1200, maintain aspect ratio
      processedImage = processedImage.resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to JPEG and optimize
    const optimizedBuffer = await processedImage
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    await writeFile(filepath, optimizedBuffer);

    // Return the public URL
    const publicUrl = `/images/${type === 'thumb' ? 'thumb' : 'lg'}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
