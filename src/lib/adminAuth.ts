import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import connectDB from './mongodb';
import User from '@/models/User';

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return false;
  }

  await connectDB();
  const user = await User.findById(session.user.id);

  return user?.isAdmin || false;
}

export async function requireAdmin() {
  const admin = await isAdmin();

  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
}
