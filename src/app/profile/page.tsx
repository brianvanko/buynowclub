import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight">My Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border border-gray-200 p-8">
          {/* Profile Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                Display Name
              </label>
              <p className="text-lg text-black">{session.user?.name || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <p className="text-lg text-black">{session.user?.email}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold uppercase tracking-tight mb-4 text-black">Quick Links</h2>
              <div className="space-y-3">
                <Link
                  href="/profile/favorites"
                  className="block p-4 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-black">My Favorites</h3>
                      <p className="text-sm text-gray-600">View and manage your favorite items</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-black underline decoration-2 underline-offset-4"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
