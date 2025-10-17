import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'Buy Now Club',
  description: 'Buy Now Club - Find and share great products',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white flex flex-col min-h-screen">
        <SessionProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
