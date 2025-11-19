import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'FratGPT - Solve Any Homework Problem Instantly',
  description: 'AI-powered homework solver for students. Snap a photo of any problem and get instant solutions with step-by-step explanations.',
  keywords: ['homework help', 'AI tutor', 'problem solver', 'study tool', 'education'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
