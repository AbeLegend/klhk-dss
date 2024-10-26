"use client";
// lib
import { FC, useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import Search from "@arcgis/core/widgets/Search";

// local
import { cn, copyToClipboard } from "@/lib";
import { Chip, DropdownLayer, SVGIcon } from "@/components/atoms";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";
import { FloatNavbar } from "@/components/templates";
import {
  getAPIWebServiceAllByUriTitle,
  getAPIWebServiceAllUriTitle,
  getAPIWebServiceByGeom,
} from "@/api/responses";
import {
  setLayer,
  toggleLayer,
  updateLayer,
} from "@/redux/Map/MapInteraktif/slice";
import { UriTitleMapType } from "@/redux/Map/MapInteraktif";
import { useAppSelector } from "@/redux/store";

const MapComponent = dynamic(() => import("./map"), {
  ssr: false,
});

export const MapInteraktifScreen: FC = () => {
  const [searchWidget, setSearchWidget] = useState<Search | null>(null);

  return (
    <main>
      <MapComponent onSearchWidgetReady={(search) => setSearchWidget(search)}>
        <FloatNavbar searchWidget={searchWidget} />
        <Sidebar />
      </MapComponent>
    </main>
  );
};

interface IsLoadingType {
  allUriTitle: boolean;
  byAllUriTitle: boolean;
}

const initIsLoadingType: IsLoadingType = {
  allUriTitle: false,
  byAllUriTitle: false,
};

const Sidebar: FC = () => {
  // useState
  const [text, setText] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // useState - isLoading
  const [isLoading, setIsLoading] = useState<IsLoadingType>(initIsLoadingType);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { location, isOpenModal, layer } = useAppSelector(
    (state) => state.mapInteraktif
  );
  // useRef
  const divRef = useRef<HTMLDivElement>(null);

  // className
  const activeClassName = "bg-primary shadow-xsmall cursor-default";
  const inActiveClassName = "bg-white shadow-xsmall cursor-pointer";

  // loadData - WebService
  const loadWebServiceAllUriTitle = async () => {
    setIsLoading((value) => ({ ...value, allUriTitle: true }));
    try {
      const { data, status } = await getAPIWebServiceAllUriTitle();
      if (status === 200) {
        const newData: UriTitleMapType[] = data.Data.map((item) => {
          return { ...item, isActive: false, isUsed: false, data: [] };
        });
        dispatch(setLayer(newData));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, allUriTitle: false }));
    }
  };

  const loadWebServiceByAllUriTitle = async (uriData: {
    UriTitle: string;
    data: UriTitleMapType;
  }) => {
    setIsLoading((value) => ({ ...value, byAllUriTitle: true }));

    try {
      const existingLayer = layer.find(
        (item) => item.UriTitle === uriData.UriTitle
      );

      if (
        existingLayer &&
        existingLayer.data &&
        existingLayer.data.length > 0
      ) {
        dispatch(
          toggleLayer({ title: uriData.UriTitle, layerData: uriData.data })
        );
        return;
      }
      dispatch(
        toggleLayer({ title: uriData.UriTitle, layerData: uriData.data })
      );
      const { data, status } = await getAPIWebServiceAllByUriTitle(
        uriData.UriTitle
      );

      if (status === 200) {
        const updatedData = layer.map((item) => {
          const matchedData = data.Data.filter(
            (apiItem) => apiItem.UriTitle === item.UriTitle
          );

          if (matchedData.length > 0) {
            const newData = matchedData.filter(
              (apiItem) =>
                !(item.data || []).some(
                  (existingData) => existingData.Id === apiItem.Id
                )
            );
            return {
              ...item,
              data: [...(item.data || []), ...newData],
            };
          }
          return item;
        });

        const inputData = updatedData.find(
          (item) => item.UriTitle === uriData.UriTitle
        );
        if (inputData) {
          dispatch(
            updateLayer({ title: uriData.UriTitle, updatedData: inputData })
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, byAllUriTitle: false }));
    }
  };

  // useEffect
  useEffect(() => {
    loadWebServiceAllUriTitle();
  }, []);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  return (
    isOpenModal && (
      <div
        className={cn([
          "absolute right-[1.5%] top-[20%] w-[40%] h-[75vh] bg-gray-gradient shadow-medium p-4 rounded-2xl overflow-y-scroll",
        ])}
        ref={divRef}
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
              <SVGIcon
                Component={LocationCrosshairsSVG}
                width={24}
                height={24}
              />
              <p className="text-body-3 text-black font-semibold">{`${location.latitude}, ${location.longitude}`}</p>
            </div>
            {/* right */}
            <p
              className={cn([
                "text-body-3 text-gray-800",
                !isCopied ? "cursor-pointer" : "cursor-default",
              ])}
              onClick={() => {
                if (!isCopied) {
                  copyToClipboard(
                    `${location.latitude}, ${location.longitude}`
                  );
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
              <p
                className={cn([
                  "text-body-3 text-gray-800 underline text-right mb-4",
                  layer.find((item) => item.isActive)
                    ? "cursor-pointer"
                    : "cursor-default",
                ])}
                onClick={() => {
                  const data: UriTitleMapType[] = layer.map((item) =>
                    item.isActive === true
                      ? {
                          ...item,
                          isActive: false,
                          isUsed: false,
                        }
                      : item
                  );

                  dispatch(setLayer(data));
                }}
              >
                Matikan semua layer
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-2 flex-wrap">
                {layer.length > 0 &&
                  layer.map((item, index) => {
                    return (
                      <Chip
                        value={item.UriTitle}
                        key={index}
                        variant={item.isActive ? "primary" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => {
                          loadWebServiceByAllUriTitle({
                            UriTitle: item.UriTitle,
                            data: item,
                          });
                        }}
                      />
                    );
                  })}
              </div>
            </DropdownLayer>
          </div>
          {/* line */}
          <div className="w-full h-[1px] bg-gray-50" />
          {/* category */}
          <div className="flex flex-wrap gap-2">
            {Array.from(
              new Set(
                layer
                  .flatMap((layer) => layer.data)
                  .map((item) => item && item.Group?.Title)
                  .filter(
                    (title) => typeof title === "string" && title.trim() !== ""
                  )
                  .sort((a, b) => (a ?? "").localeCompare(b ?? ""))
              )
            ).map((title, index) => (
              <div
                key={index}
                className={cn([
                  "px-4 py-2 rounded-lg",
                  text === title ? activeClassName : inActiveClassName,
                  "border border-gray-300",
                ])}
                onClick={() => {
                  if (title) setText(title);
                }}
              >
                <p
                  className={cn([
                    "text-body-3",
                    text === title ? "text-white" : "text-gray-700",
                    "font-medium",
                  ])}
                >
                  {title}
                </p>
              </div>
            ))}
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
    )
  );
};
