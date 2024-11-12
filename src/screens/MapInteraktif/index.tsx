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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useRef
  const sidebarRef = useRef<{ triggerAction: () => void }>(null);
  // handle
  const handleTriggerSidebarAction = () => {
    sidebarRef.current?.triggerAction();
  };
  // function

  return (
    <main>
      {!isLoading && (
        <MapComponent
          onSearchWidgetReady={(search) => setSearchWidget(search)}
          onTriggerSidebar={handleTriggerSidebarAction}
        >
          <FloatNavbar searchWidget={searchWidget} />
          <Sidebar ref={sidebarRef} />
        </MapComponent>
      )}
    </main>
  );
};
