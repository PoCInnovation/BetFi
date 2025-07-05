import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import FloatingChatbot from "@/components/floating-chatbot";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BetFi - Decentralized Trading Strategy Platform",
  description: "Bet on elite trading strategies and share the alpha. Invest alongside top traders in DeFi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          {children}
          <FloatingChatbot />
          <Toaster 
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
            theme="dark"
          />
        </Providers>
      </body>
    </html>
  );
}
