import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checksheet Fasilitas - Depo Lokomotif Cirebon',
  description: 'Sistem Monitoring dan Perawatan Lokomotif',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
