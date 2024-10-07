// lib
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard B",
  description: "DSS KLHK - Dashboard B",
};

export default function DashboardBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-primary min-h-screen">{children}</main>;
}
