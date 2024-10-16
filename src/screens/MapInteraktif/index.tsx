"use client";
// lib
import { FC, useEffect, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";

// local
import { cn, copyToClipboard } from "@/lib";
import { Chip, DropdownLayer, SVGIcon } from "@/components/atoms";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";
import { FloatNavbar } from "@/components/templates";
import { WebServiceModel } from "@/api/types";
import { getAPIWebServiceAll } from "@/api/responses";
import { setLayer, toggleLayer } from "@/redux/Map/MapInteraktif/slice";

const MapComponent = dynamic(() => import("./map"), {
  ssr: false,
});
export const MapInteraktifScreen: FC = () => {
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

interface WebServiceProps extends WebServiceModel {
  isActive: boolean;
  isUsed: boolean;
}

const Sidebar: FC = () => {
  // useState
  const [text, setText] = useState<string>("Deteksi Perencanaan & Pengelolaan");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // useState - layer
  // const [webService, setWebService] = useState<WebServiceProps[]>([]);
  // useState - isLoading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { layer } = useAppSelector((state) => state.mapInteraktif);

  // className
  const activeClassName = "bg-primary shadow-xsmall cursor-default";
  const inActiveClassName = "bg-white shadow-xsmall cursor-pointer";
  // function
  const updateWebService = (updatedData: {
    id: number;
    data: WebServiceProps;
  }) => {
    const { data, id } = updatedData;

    dispatch(
      toggleLayer({
        id: id,
        layerData: data,
      })
    );
  };
  // loadData - WebService
  const loadWebService = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await getAPIWebServiceAll();
      if (status === 200) {
        const newData: WebServiceProps[] = data.Data.map((item) => {
          return { ...item, isActive: false, isUsed: false };
        });
        dispatch(setLayer(newData));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect
  useEffect(() => {
    loadWebService();
  }, []);

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
            <p
              className={cn([
                "text-body-3 text-gray-800 underline text-right mb-4",
                layer.find((item) => item.isActive)
                  ? "cursor-pointer"
                  : "cursor-default",
              ])}
              onClick={() => {
                const data: WebServiceProps[] = layer.map((item) =>
                  item.isActive === true
                    ? { ...item, isActive: false, isUsed: false }
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
                      value={item.Title}
                      key={index}
                      variant={item.isActive ? "primary" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => {
                        // updateWebService(item.Id, !item.isActive, false, item);
                        // updateWebService(item.Id, item);
                        updateWebService({
                          id: item.Id,
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
