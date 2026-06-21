import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/store/Providers'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { ToastProvider } from '@/components/common/Toast'
import AuthInitializer from '@/components/common/AuthInitializer'
import SocketInitializer from '@/components/common/SocketInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s | ShopHub', default: 'ShopHub — Premium E-Commerce' },
  description: 'Shop the latest products at the best prices.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <ToastProvider>
            <AuthInitializer />
            <SocketInitializer />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  )
}