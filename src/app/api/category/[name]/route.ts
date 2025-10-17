import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';

// GET /api/category/:name - Get items by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    await connectDB();
    const { name } = await params;

    const categoryName = name.toUpperCase();
    const items = await Item.find({ categories: categoryName }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: items
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
