// lib
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - DSS KLHK",
  description: "DSS KLHK",
};

export default function DashboardFixLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
