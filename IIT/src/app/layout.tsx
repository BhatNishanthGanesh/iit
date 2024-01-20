import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { FlyoutNav } from "./components/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
// const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({
//   weight: '400',
//   subsets: ['latin'],
// })
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <FlyoutNav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
