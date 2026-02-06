import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    default: 'track.me - Subscription Tracker',
    template: '%s | track.me'
  },
  description: 'Track subscriptions. Know what\'s coming. track.me helps you manage recurring income and subscriptions without spreadsheets or complexity.',
  openGraph: {
    title: 'track.me - Subscription Tracker',
    description: 'Track subscriptions. Know what\'s coming. track.me helps you manage recurring income and subscriptions without spreadsheets or complexity.',
    type: 'website',
    url: 'https://trackme.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'track.me - Subscription Tracker',
    description: 'Track subscriptions. Know what\'s coming.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}