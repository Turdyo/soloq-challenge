import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "SoloQ Challenge 4eS",
  description: "SoloQ Challenge 4eS tracker par Turdyo le goat"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} dark`}>
        <header className="sticky top-0 z-50 h-16 w-full border-b shadow backdrop-blur">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
            <h1 className="text-2xl font-bold">Soloq Challenge 4eS</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
