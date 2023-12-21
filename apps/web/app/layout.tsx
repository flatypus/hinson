import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hi, I'm Hinson",
  description: "Hinson's site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link href="https://applesocial.s3.amazonaws.com" rel="preconnect" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
