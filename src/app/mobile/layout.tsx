import type { Metadata } from 'next';
import './mobile.css';

export const metadata: Metadata = {
  title: 'Beach Cleanup Aruba - Mobile',
  description: 'Mobile-optimized beach cleanup tracking for Aruba',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#FF0000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Beach Cleanup Aruba" />
      </head>
      <body className="mobile-body">
        {children}
      </body>
    </html>
  );
}
