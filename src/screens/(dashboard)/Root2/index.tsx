"use client";
// lib
import { FC, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Image from "next/image";

// local
import { cn, copyToClipboard } from "@/lib";
import { DropdownLayer, SVGIcon } from "@/components/atoms";

// asset
import LogoFullImage from "@/images/logo/logo-full-dark.png";
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import SearchSVG from "@/icons/search.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";

export const DashboardRoot2Screen: FC = () => {
  // useRef
  const mapRef = useRef<HTMLDivElement>(null);
  // useState
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (mapRef.current) {
      const webMap = new WebMap({
        basemap: "topo-vector",
        // portalItem: {
        //   id: "8d91bd39e873417ea21673e0fee87604",
        // },
      });
      const view = new MapView({
        container: mapRef.current,
        map: webMap,
        center: [120.0, 0.0],
        zoom: 5,
      });
      const abortController = new AbortController();

      view.ui.remove("zoom");

      view
        .when(() => {
          console.log("Map loaded successfully!");
          setIsMapLoaded(true);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Loading the map was aborted");
          } else {
            console.error("Error loading the map:", error);
          }
        });
      return () => {
        abortController.abort();
        if (view) {
          view.destroy();
        }
      };
    }
  }, [isMapLoaded]);

  return (
    <main>
      <div ref={mapRef} className={cn(["h-screen w-full"])}>
        {/* <div className={cn(["h-screen w-full bg-black"])}> */}
        {isMapLoaded && (
          <>
            <Navbar />
            <Sidebar />
          </>
        )}
      </div>
    </main>
  );
};

// Component Navbar
const Navbar: FC = () => {
  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[97.5%] h-[14vh] bg-white rounded-2xl p-4">
      <div className="flex gap-x-4 items-center self-center">
        {/* Logo */}
        <div className="relative h-[59px] w-[273px]">
          <Image src={LogoFullImage} alt="logo" layout="fill" />
        </div>
        {/* line */}
        <div className="h-[64px] w-[1px] bg-gray-200" />
        {/* upload file */}
        <div className="px-2 py-1 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex gap-x-14 h-[64px] items-center">
          <div>
            <p className="text-body-3 text-gray-900 font-medium mb-1">
              Upload SHP
            </p>
            <p className="text-xs text-gray-600">
              Cari wilayah berdasarkan file SHP
            </p>
          </div>
          <button className="px-[10px] py-[6px] rounded-lg bg-accent text-body-3 text-white h-fit">
            Pilih File
          </button>
        </div>
        {/* line */}
        <div className="h-[64px] w-[1px] bg-gray-200" />
        {/* search */}
        <div>
          <p className="text-body-3 text-gray-900 font-medium mb-1">Cari</p>
          <div className="border  rounded-lg flex py-[10px] px-3 w-[376px] gap-x-3 items-center">
            <SVGIcon Component={SearchSVG} />
            <p className="text-body-3 text-gray-400">
              Masukan Koordinat atau lokasi
            </p>
          </div>
        </div>
      </div>
    </nav>
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
