import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ isAdmin: false });
    }

    await connectDB();
    const user = await User.findById(session.user.id);

    return NextResponse.json({ isAdmin: user?.isAdmin || false });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}
