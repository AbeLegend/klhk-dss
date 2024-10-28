// lib
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Statistik",
  description: "DSS KLHK - Dashboard Statistik",
};

export default function DashboardStatistikLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-primary min-h-screen">{children}</main>;
}
