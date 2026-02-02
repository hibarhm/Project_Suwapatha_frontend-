import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Suwapatha - Seamless Healthcare, Simplified for You',
  description: 'Connecting patients, doctors, and administrators through a unified, efficient, and compassionate digital health platform.',
  keywords: ['healthcare', 'OPD booking', 'hospital appointments', 'Sri Lanka', 'digital health'],
  authors: [{ name: 'Suwapatha Team' }],
  openGraph: {
    title: 'Suwapatha - Seamless Healthcare Platform',
    description: 'Book hospital appointments, manage health records, and access healthcare services seamlessly.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}