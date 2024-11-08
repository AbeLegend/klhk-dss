"use client";
// lib
import { FC } from "react";
// local
import { MapInteraktifScreenHardCoded } from "@/screens";
import { useAutoLogout } from "@/hook";

const MapInteraktif: FC = () => {
  useAutoLogout();
  return <MapInteraktifScreenHardCoded />;
};

export default MapInteraktif;
