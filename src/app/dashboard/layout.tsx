// // lib
// import { Navbar } from "@/components/templates";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Dashboard - DSS KLHK",
//   description: "DSS KLHK",
// };

// export default function DashboardLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <section>
//       {/* <Navbar /> */}
//       {children}
//     </section>
//   );
// }

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
