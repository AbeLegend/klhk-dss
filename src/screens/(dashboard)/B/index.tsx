// lib
import { FC } from "react";
// local
import { CardScreen, Navbar } from "@/components/templates";

// type
interface DashboardScreenProps {}

export const DashboardBScreen: FC<DashboardScreenProps> = ({}) => {
  return (
    <div className="">
      <Navbar />
      <CardScreen
        backButton
        textLeft="Statistik Dashboard B"
        textRight="Rabu, 28 Agustus 2024"
        // description="PT Antam Tbk"
      >
        <p>tes</p>
      </CardScreen>
    </div>
  );
};
