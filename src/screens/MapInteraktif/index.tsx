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
import { WebServiceModel } from "@/api/types";
import { getAPIWebServiceAll, getAPIWebServiceByGeom } from "@/api/responses";
import { setLayer, toggleLayer } from "@/redux/Map/MapInteraktif/slice";
import { ReduxLayerItem } from "@/redux/Map/MapInteraktif";
import { useAppSelector } from "@/redux/store";

const MapComponent = dynamic(() => import("./map"), {
  ssr: false,
});

export const MapInteraktifScreen: FC = () => {
    const [searchWidget, setSearchWidget] = useState<Search | null>(null);

  return (
    // <main className="bg-black w-screen h-screen">
    <main>
      <MapComponent onSearchWidgetReady={(search) => setSearchWidget(search)}>
        <FloatNavbar searchWidget={searchWidget} />
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
  // useState - isLoading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { layer, location, isOpenModal } = useAppSelector(
    (state) => state.mapInteraktif
  );
  // useRef
  const divRef = useRef<HTMLDivElement>(null);

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
        const layerData: ReduxLayerItem[] = newData.map((item) => {
          return {
            WebService: item,
            Properties: [],
          };
        });
        dispatch(setLayer(layerData));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWebServiceByGeom = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await getAPIWebServiceByGeom();
      if (status === 200) {
        const updatedData = data.Data.map((item) => ({
          ...item,
          WebService: {
            ...item.WebService,
            isUsed: false,
            isActive: false,
          },
        }));
        dispatch(setLayer(updatedData));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect
  useEffect(() => {
    // loadWebService();
    loadWebServiceByGeom();
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
                  layer.find((item) => item.WebService.isActive)
                    ? "cursor-pointer"
                    : "cursor-default",
                ])}
                onClick={() => {
                  const data: WebServiceProps[] = layer.map((item) =>
                    item.WebService.isActive === true
                      ? {
                          ...item.WebService,
                          isActive: false,
                          isUsed: false,
                        }
                      : item.WebService
                  );

                  const layerData: ReduxLayerItem[] = data.map((item) => {
                    return {
                      WebService: item,
                      Properties: [],
                    };
                  });
                  dispatch(setLayer(layerData));
                }}
              >
                Matikan semua layer
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-2 flex-wrap">
                {layer.length > 0 &&
                  layer.map((item, index) => {
                    return (
                      <Chip
                        value={item.WebService.Title}
                        key={index}
                        variant={
                          item.WebService.isActive ? "primary" : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          updateWebService({
                            id: item.WebService.Id,
                            data: item.WebService,
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
              new Map(
                layer.map((item) => [
                  item.WebService.Group.Id,
                  item.WebService.Group,
                ])
              ).values()
            ).map((group, index) => (
              <div
                className={cn([
                  "px-4 py-2 rounded-lg",
                  text === group.Title ? activeClassName : inActiveClassName,
                  "border border-gray-300",
                ])}
                key={index}
                onClick={() => {
                  setText(group.Title);
                }}
              >
                <p
                  className={cn([
                    "text-body-3",
                    text === group.Title ? "text-white" : "text-gray-700",
                    "font-medium",
                  ])}
                >
                  {group.Title}
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
