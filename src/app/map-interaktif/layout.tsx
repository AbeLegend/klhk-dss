// lib
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Interaktif - DSS KLHK",
  description: "Map Interaktif - DSS KLHK",
};

export default function MapInteraktifLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
