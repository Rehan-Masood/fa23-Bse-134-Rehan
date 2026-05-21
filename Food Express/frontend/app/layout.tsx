import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Food Express - Premium Food Delivery',
  description: 'Order delicious food from top restaurants and get it delivered to your door in minutes.',
  keywords: ['food delivery', 'restaurant', 'order online', 'fast delivery'],
  authors: [{ name: 'Food Express' }],
  openGraph: {
    title: 'Food Express',
    description: 'Premium food delivery service',
    url: 'https://foodexpress.com',
    siteName: 'Food Express',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white font-sans transition-colors duration-300 dark:bg-slate-900">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
