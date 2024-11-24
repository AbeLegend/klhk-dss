"use client";
// lib
import { FC, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import dynamic from "next/dynamic";
import Search from "@arcgis/core/widgets/Search";

// local
import { Sidebar } from "./sidebar";
import { FloatNavbar } from "@/components/templates";
import { usePermissions } from "@/hook";
import { useAppSelector } from "@/redux/store";
import { OverlaySHP } from "@/components/molecules";
import { OverlayWidget } from "@/components/atoms";

// asset

const MapComponent = dynamic(() => import("./map"), {
  ssr: false,
});

export const MapInteraktifScreen: FC = () => {
  // usePermissions
  usePermissions({
    hasPermission: "Pages.Map.Interactive",
    redirect: "/dashboard",
  });

  // useState
  const [searchWidget, setSearchWidget] = useState<Search | null>(null);

  // useRef
  const sidebarRef = useRef<{ triggerAction: () => void }>(null);
  // useAppSelector
  const IsLoading = useAppSelector((state) => state.loading);
  const { IsShowOverlay } = useAppSelector((state) => state.layer);
  // handle
  const handleTriggerSidebarAction = () => {
    sidebarRef.current?.triggerAction();
  };
  // function

  return (
    <main>
      <MapComponent
        onSearchWidgetReady={(search) => setSearchWidget(search)}
        onTriggerSidebar={handleTriggerSidebarAction}
      >
        {IsLoading.general && (
          <div className="absolute top-0 left-0 inset-0 bg-black opacity-80 z-[9999999999999] flex justify-center items-center">
            <div className="relative bg-inherit w-14 h-14 rounded-full border-4 border-slate-600 border-b-transparent animate-spin" />
          </div>
        )}
        <OverlayWidget />
        {IsShowOverlay && <OverlaySHP />}
        <FloatNavbar searchWidget={searchWidget} />
        <Sidebar ref={sidebarRef} />
      </MapComponent>
    </main>
  );
};
