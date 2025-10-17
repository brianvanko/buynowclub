import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';

// GET /api/items - Get all items with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'newest';

    let query = {};
    if (category) {
      query = { categories: category.toUpperCase() };
    }

    // Determine sort order
    let sort: any = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await User.findById(session.user.id);
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const item = await Item.create({
      name: body.name,
      description: body.description,
      link: body.link,
      thumb: body.thumb,
      lg_img: body.lg_img,
      categories: body.categories,
      subcategory: body.subcategory,
      price: body.price,
      short_name: body.short_name,
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item created successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
