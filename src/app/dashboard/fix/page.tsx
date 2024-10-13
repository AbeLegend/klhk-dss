import { DashboardRoot2Screen } from "@/screens";
// import dynamic from "next/dynamic";
// const MapWithGeocoding = dynamic(
//   () => import("../../../components/organisms/MapWithGeocoding"),
//   { ssr: false }
// );

export default function Home() {
  return (
    <main>
      <DashboardRoot2Screen />
      {/* <MapWithGeocoding /> */}
    </main>
  );
}
