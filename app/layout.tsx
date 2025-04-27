import type React from "react"
import type { Metadata } from "next"
import { geistSans } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "V0 Blocks",
  description: "A 3D block building application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} overflow-hidden`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geistSans.className} antialiased overflow-hidden`}>{children}</body>
    </html>
  )
}
