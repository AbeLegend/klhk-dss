// lib
import type { Metadata } from "next";
// local
import "./globals.css";
import { poppins } from "@/lib";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "KLHK DSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
