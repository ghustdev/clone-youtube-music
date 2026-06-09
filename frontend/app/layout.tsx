import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Music Clone",
  description: "Trabalho de POO - Backend Java",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="h-screen flex flex-col bg-black text-white font-sans overflow-hidden">
        {/* Corpo principal */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          {/* Aqui é onde as páginas (Home, Explore, Library) vão aparecer */}
          <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
            {children}
          </main>
        </div>

        {/* Player fixo no rodapé */}
        <Player />
      </body>
    </html>
  );
}
