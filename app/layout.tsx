import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MealMatch',
  description: 'Plan your meals based on your grocery receipt or manually entered ingredients.',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
