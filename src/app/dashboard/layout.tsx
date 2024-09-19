// lib
import { Navbar } from "@/components/templates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - DSS KLHK",
  description: "DSS KLHK",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
