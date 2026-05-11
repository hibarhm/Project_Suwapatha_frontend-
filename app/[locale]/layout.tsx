import type { Metadata } from 'next'
import {NextIntlClientProvider} from 'next-intl'
import {getLocale, getMessages} from 'next-intl/server'
import {Noto_Sans_Sinhala, Noto_Sans_Tamil, Poppins} from 'next/font/google'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const sinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sinhala',
  display: 'swap',
})

const tamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-tamil',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${poppins.variable} ${sinhala.variable} ${tamil.variable}`}>
      {/* 
        Font selection is locale-aware so Tamil/Sinhala scripts render correctly.
        We still register all font variables at <html> for consistent fallback behavior.
      */}
      <body className={locale === 'si' ? sinhala.className : locale === 'ta' ? tamil.className : poppins.className}>
        {/* Translation provider is mounted at the root so existing route groups continue to work. */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}