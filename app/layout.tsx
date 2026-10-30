import { Suspense } from "react";
import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Pagetransition from "@/components/Pagetransition/Pagetransition";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Background from "@/components/layout/background";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "LooP",
  description: "Build. Share. Repeat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-loop-bg font-body text-loop-text antialiased">
  <Background />
  <Suspense fallback={null}>
    <Navbar />
  </Suspense>
  <Suspense fallback={null}>
    <Pagetransition>{children}</Pagetransition>
  </Suspense>
  <Footer />
</body>
    </html>
  );
}
