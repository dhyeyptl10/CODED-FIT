import type { Metadata } from 'next';
import './globals.css';
import './reference-theme.css';
import './studio.css';
import {SessionRestore} from '@/components/auth/SessionRestore';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';
import { LoginModal } from '@/components/auth/LoginModal';
import { AIChat } from '@/components/ai/AIChat';

export const metadata: Metadata = {
  title: 'CODED FIT — Wear Your Own Code',
  description: "Discover clothing, personalize your wardrobe, and explore 3D and photo try-on with CODED FIT.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-alabaster text-obsidian antialiased selection:bg-gold selection:text-obsidian">
        <SessionRestore />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <LoginModal />
        <AIChat />
      </body>
    </html>
  );
}

