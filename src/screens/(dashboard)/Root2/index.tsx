"use client";
// lib
import { FC, useEffect, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import dynamic from "next/dynamic";

// local
import { cn, copyToClipboard } from "@/lib";
import { DropdownLayer, SVGIcon } from "@/components/atoms";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";
import { FloatNavbar } from "@/components/templates";

const MapComponent = dynamic(() => import("@/components/organisms/MapFix"), {
  ssr: false,
});

export const DashboardRoot2Screen: FC = () => {
  return (
    // <main className="bg-black w-screen h-screen">
    <main>
      <MapComponent>
        <FloatNavbar />
        <Sidebar />
      </MapComponent>
    </main>
  );
};

const Sidebar: FC = () => {
  const [text, setText] = useState<string>("Deteksi Perencanaan & Pengelolaan");

  const [isCopied, setIsCopied] = useState<boolean>(false);

  // className
  const activeClassName = "bg-primary shadow-xsmall cursor-default";
  const inActiveClassName = "bg-white shadow-xsmall cursor-pointer";

  // useEffect
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  return (
    <div
      className={cn([
        "absolute right-[1.5%] top-[20%] w-[40%] h-[75vh] bg-gray-gradient shadow-medium p-4 rounded-2xl overflow-y-scroll",
      ])}
    >
      <div className="grid gap-y-6">
        {/* location */}
        <div
          className={cn([
            "bg-white shadow-xsmall rounded-2xl py-2 px-4 flex justify-between items-center",
          ])}
        >
          {/* left */}
          <div className="flex gap-x-[14px] items-center">
            <SVGIcon Component={LocationCrosshairsSVG} width={24} height={24} />
            <p className="text-body-3 text-black font-semibold">
              -109.9439, -7.2987
            </p>
          </div>
          {/* right */}
          <p
            className={cn([
              "text-body-3 text-gray-800",
              !isCopied ? "cursor-pointer" : "cursor-default",
            ])}
            onClick={() => {
              if (!isCopied) {
                copyToClipboard("-109.9439, -7.2987");
                setIsCopied(true);
              }
            }}
          >
            {isCopied ? "Copied" : "Copy"}
          </p>
        </div>
        {/* layer */}
        <div className={cn([])}>
          <DropdownLayer>
            <p>tes</p>
          </DropdownLayer>
        </div>
        {/* line */}
        <div className="w-full h-[1px] bg-gray-50" />
        {/* category */}
        <div className="flex flex-wrap gap-2">
          <div
            className={cn([
              "px-4 py-2 rounded-lg",
              text === "Deteksi Perencanaan & Pengelolaan"
                ? activeClassName
                : inActiveClassName,
              "border border-gray-300",
            ])}
            onClick={() => {
              setText("Deteksi Perencanaan & Pengelolaan");
            }}
          >
            <p
              className={cn([
                "text-body-3",
                text === "Deteksi Perencanaan & Pengelolaan"
                  ? "text-white"
                  : "text-gray-700",
                "font-medium",
              ])}
            >
              Deteksi Perencanaan & Pengelolaan
            </p>
          </div>
          <div
            className={cn([
              "px-4 py-2 rounded-lg",
              text === "Laju Perubahan" ? activeClassName : inActiveClassName,
              "border border-gray-300",
            ])}
            onClick={() => {
              setText("Laju Perubahan");
            }}
          >
            <p
              className={cn([
                "text-body-3",
                text === "Laju Perubahan" ? "text-white" : "text-gray-700",
                "font-medium",
              ])}
            >
              Laju Perubahan
            </p>
          </div>
          <div
            className={cn([
              "px-4 py-2 rounded-lg",
              text === "Alur & Status Tahapan"
                ? activeClassName
                : inActiveClassName,
              "border border-gray-300",
            ])}
            onClick={() => {
              setText("Alur & Status Tahapan");
            }}
          >
            <p
              className={cn([
                "text-body-3",
                text === "Alur & Status Tahapan"
                  ? "text-white"
                  : "text-gray-700",
                "font-medium",
              ])}
            >
              Alur & Status Tahapan
            </p>
          </div>
        </div>
        {/* line */}
        <div className="w-full h-[1px] bg-gray-50" />
        {/* perencanaan No. 1 */}
        <ContainerInformation title="Perencanaan">
          <ContainerData
            containerClassName="grid-cols-2"
            data={[
              {
                title: "Fungsi",
                description: "Cagar Alam",
              },
              {
                title: "Luas",
                description: "500 Ha",
                dataClassName: "justify-self-end",
              },
            ]}
          />
        </ContainerInformation>
        {/* pengelolaan No. 1 */}
        <ContainerInformation title="Pengelolaan">
          <div className="flex">
            <div
              className={cn([
                "py-[10px] px-4 bg-primary rounded-l-lg",
                activeClassName,
                "border border-gray-300",
                "w-1/2",
              ])}
            >
              <p className="text-body-3 text-white font-medium text-center">
                Informasi
              </p>
            </div>
            <div
              className={cn([
                "py-[10px] px-4 bg-primary rounded-r-lg",
                inActiveClassName,
                "border border-gray-300",
                "w-1/2",
              ])}
            >
              <p className="text-body-3 text-gray-700 font-medium text-center">
                History dan Perubahan
              </p>
            </div>
          </div>
        </ContainerInformation>
      </div>
    </div>
  );
};
