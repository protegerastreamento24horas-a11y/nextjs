import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rifa Premiada",
  description: "Sistema de rifas automáticas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-900`}
      >
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-white font-bold text-xl">
                  Rifa Premiada
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Início
                </Link>
                <Link href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}