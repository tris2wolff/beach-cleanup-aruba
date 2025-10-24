import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aruba Clean Beaches — Community-Powered Beach Cleanups & Map',
  description: 'Track and map beach cleanups across Aruba. See which beaches need attention, log your cleanup efforts, and help keep Aruba\'s coastlines beautiful.',
  openGraph: {
    title: 'Aruba Clean Beaches — Community-Powered Beach Cleanups & Map',
    description: 'Track and map beach cleanups across Aruba. See which beaches need attention, log your cleanup efforts, and help keep Aruba\'s coastlines beautiful.',
    url: 'https://beach-cleanup-aruba.web.app/',
    siteName: 'Aruba Clean Beaches',
    images: [
      {
        url: 'https://beach-cleanup-aruba.web.app/src/assets/images/aruba-map-preview.png',
        width: 1200,
        height: 630,
        alt: 'Aruba Beach Cleanup Map',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aruba Clean Beaches — Community-Powered Beach Cleanups & Map',
    description: 'Track and map beach cleanups across Aruba. See which beaches need attention, log your cleanup efforts, and help keep Aruba\'s coastlines beautiful.',
    images: ['https://beach-cleanup-aruba.web.app/src/assets/images/aruba-map-preview.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          async
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
