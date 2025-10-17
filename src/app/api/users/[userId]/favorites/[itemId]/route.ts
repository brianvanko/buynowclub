import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// PUT /api/users/:userId/favorites/:itemId - Add item to favorites
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      params.userId,
      { $addToSet: { favorites: params.itemId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { itemId: params.itemId },
      message: 'Item added to favorites'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:userId/favorites/:itemId - Remove item from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      params.userId,
      { $pull: { favorites: params.itemId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { itemId: params.itemId },
      message: 'Item removed from favorites'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
