'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('/api/auth/check-admin')
        .then((res) => res.json())
        .then((data) => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  const navItems = [
    { name: 'GEAR', href: '/items/category/GEAR' },
    { name: 'STYLE', href: '/items/category/STYLE' },
    { name: 'TECH', href: '/items/category/TECH' },
    { name: 'SHELTER', href: '/items/category/SHELTER' },
    { name: 'VICES', href: '/items/category/VICES' },
    { name: 'BODY', href: '/items/category/BODY' },
    { name: 'ETC', href: '/items/category/ETC' },
  ];

  return (
    <>
      <header className="bg-black text-white">
        <div className="container mx-auto px-4">
          {/* Top bar with logo */}
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="text-4xl font-bold tracking-tight">
              buynow<span className="text-gray-400">club</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hover:text-gray-300"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 hover:text-gray-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                      {(session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-20 py-2 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-black">
                            {session.user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile/favorites"
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                        >
                          My Favorites
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            signOut({ callbackUrl: '/' });
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="hover:text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="border-t border-gray-800">
            <ul className="flex items-center justify-center gap-8 py-4 text-sm font-medium tracking-wider">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`hover:text-gray-300 transition-colors ${
                      pathname === item.href ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Secondary Navigation */}
          <nav className="border-t border-gray-800">
            <ul className="flex items-center justify-center gap-6 py-3 text-xs tracking-wider text-gray-400">
              <li><Link href="/items" className="hover:text-white">ALL ITEMS</Link></li>
              {isAdmin && (
                <li><Link href="/admin" className="hover:text-white">ADMIN</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="bg-black border-b border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <form
              className="max-w-2xl mx-auto relative"
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }
              }}
            >
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 text-white px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
