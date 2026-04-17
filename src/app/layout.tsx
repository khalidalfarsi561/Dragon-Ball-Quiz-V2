import type { Metadata } from 'next';
import { Tajawal, Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ReactNode } from 'react';
import Header from '@/components/Header';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
});

// Avoid using localhost fallback in shipped metadata logic
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | دراغون بول كويز',
    default: 'اختبار دراغون بول - Dragon Ball Quiz',
  },
  description: 'منصة اختبارات دراغون بول النهائية والتحديات. اختبر مستوى طاقتك الآن!',
  openGraph: {
    title: 'اختبار دراغون بول',
    description: 'منصة اختبارات دراغون بول النهائية والتحديات. اختبر مستوى طاقتك الآن!',
    url: siteUrl,
    siteName: 'Dragon Ball Quiz',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اختبار دراغون بول',
    description: 'منصة اختبارات دراغون بول النهائية والتحديات. اختبر مستوى طاقتك الآن!',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-orange-500/30">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col pt-20">
          {children}
        </main>
        <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-800/50 mt-auto">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - غير رسمي وللمتعة فقط.
        </footer>
        <Toaster dir="rtl" position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
