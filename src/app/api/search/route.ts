import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';

// GET /api/search?q=query - Search items
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Search in name, description, and categories
    const items = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } },
      ]
    }).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
