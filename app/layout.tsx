import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalBottomNav from "@/components/GlobalBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Testbäddsguiden",
  description:
    "En steg-för-steg-arbetsbok för att etablera, driva eller skala en testbädd. Innovation Helsingborg.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <GlobalBottomNav />
      </body>
    </html>
  );
}
