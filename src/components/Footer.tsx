import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4">Buy Now Club</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curated products and experiences for the discerning consumer.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/items" className="text-gray-400 hover:text-white transition-colors">
                  All Items
                </Link>
              </li>
              <li>
                <Link href="/items/category/TECH" className="text-gray-400 hover:text-white transition-colors">
                  Tech
                </Link>
              </li>
              <li>
                <Link href="/items/category/VICES" className="text-gray-400 hover:text-white transition-colors">
                  Vices
                </Link>
              </li>
              <li>
                <Link href="/items/category/GAMES" className="text-gray-400 hover:text-white transition-colors">
                  Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile/favorites" className="text-gray-400 hover:text-white transition-colors">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Buy Now Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
