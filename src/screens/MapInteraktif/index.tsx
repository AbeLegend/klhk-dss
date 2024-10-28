"use client";
// lib
import {
  FC,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import Search from "@arcgis/core/widgets/Search";
import { HiOutlineX } from "react-icons/hi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// local
import { cn, COOKIE_TOKEN, copyToClipboard, decryptText } from "@/lib";
import {
  Chip,
  DropdownLayer,
  SkeletonLoading,
  SVGIcon,
} from "@/components/atoms";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";
import { DataDisplayComponent, FloatNavbar } from "@/components/templates";
import {
  getAPIRoleGetById,
  getAPIUserGetById,
  getAPIWebServiceAllByUriTitle,
  getAPIWebServiceAllUriTitle,
  getAPIWebServiceGetPropertiesByGeom,
} from "@/api/responses";
import {
  setIsOpenModalMap,
  setLayer,
  setLocation,
  toggleLayer,
  updateLayer,
} from "@/redux/Map/MapInteraktif/slice";
import {
  DataWebserviceByGeom,
  UriTitleMapType,
} from "@/redux/Map/MapInteraktif";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

const MapComponent = dynamic(() => import("./map"), {
  ssr: false,
});

export const MapInteraktifScreen: FC = () => {
  // token
  const token = Cookies.get(COOKIE_TOKEN);

  // useState
  const [searchWidget, setSearchWidget] = useState<Search | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useRef
  const sidebarRef = useRef<{ triggerAction: () => void }>(null);
  // useRouter
  const router = useRouter();
  // handle
  const handleTriggerSidebarAction = () => {
    sidebarRef.current?.triggerAction();
  };
  // function
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      if (token) {
        const dec: {
          sub: string;
        } = jwtDecode(decryptText(token));
        await getAPIUserGetById(dec.sub).then(async (res) => {
          const idRole = res.data.Data.Roles[0].Id;
          const response = await getAPIRoleGetById(idRole);
          const hasInteractivePermission =
            response.data.Data.Permissions.includes("Pages.Map.Interactive");
          if (!hasInteractivePermission) {
            router.replace("/dashboard");
          }
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  // useLayoutEffect
  useLayoutEffect(() => {
    loadUserData();
  }, [token]);
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

interface IsLoadingType {
  allUriTitle: boolean;
  byAllUriTitle: boolean;
  getPropertiesByGeom: boolean;
}

const initIsLoadingType: IsLoadingType = {
  allUriTitle: false,
  byAllUriTitle: false,
  getPropertiesByGeom: false,
};

const Sidebar = forwardRef((_, ref) => {
  // useState
  const [groupTitleText, setGroupTitleText] = useState<string>("");
  const [groupCategoryText, setGroupCategoryText] = useState<string>("");

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
  // data
  const activeData = layer.filter((item) => item.isActive && item.data);

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
      // Check if layer with the same UriTitle already exists
      const existingLayer = layer.find(
        (item) => item.UriTitle === uriData.UriTitle
      );

      // If data already exists, toggle layer and stop the process
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

      // Toggle layer before loading new data
      dispatch(
        toggleLayer({ title: uriData.UriTitle, layerData: uriData.data })
      );

      // Fetch data from API
      const { data, status } = await getAPIWebServiceAllByUriTitle(
        uriData.UriTitle
      );

      if (status === 200) {
        // Prepare data for updating the layer
        const updatedData = layer.map((item) => {
          if (item.UriTitle === uriData.UriTitle) {
            // Match data from API based on `UriTitle` and reset Properties to []
            const newData: DataWebserviceByGeom[] = data.Data.filter(
              (apiItem) =>
                !(item.data || []).some(
                  (existingData) => existingData.WebService.Id === apiItem.Id
                )
            ).map((apiItem) => ({
              WebService: {
                ...apiItem, // Assuming `apiItem` has the structure of `WebServiceModel`
                activeCategory: "", // Set default value or derive as needed
                activeGroupCategory: "", // Set default value or derive as needed
              },
              Properties: [], // Reset to an empty array as required
            }));
            return { ...item, data: [...(item.data || []), ...newData] };
          }
          return item;
        });

        // Find the updated data for the specified `UriTitle`
        const inputData = updatedData.find(
          (item) => item.UriTitle === uriData.UriTitle
        );

        // If data is found, update the layer using `updateLayer`
        if (inputData) {
          dispatch(
            updateLayer({
              title: uriData.UriTitle,
              updatedData: { data: inputData.data },
            })
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (location.latitude && location.longitude) {
        loadWebServiceGetPropertiesByGeom();
      }
      setIsLoading((value) => ({ ...value, byAllUriTitle: false }));
    }
  };

  const loadWebServiceGetPropertiesByGeom = async () => {
    setIsLoading((value) => ({ ...value, getPropertiesByGeom: true }));

    try {
      if (location.latitude && location.longitude) {
        const { data, status } = await getAPIWebServiceGetPropertiesByGeom({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        if (status === 200) {
          const propertiesData = data.Data;

          // Filter hanya untuk layer yang `isActive: true`
          const activeLayers = layer.filter((layerItem) => layerItem.isActive);

          // Update layer aktif dengan data Properties baru
          activeLayers.forEach((activeLayer) => {
            if (activeLayer.data) {
              // Tambahkan pengecekan untuk memastikan `data` ada
              const updatedData = activeLayer.data.map((layerDataItem) => {
                // Temukan `Properties` yang sesuai berdasarkan `WebService.Id`
                const apiProperties = propertiesData.find(
                  (apiItem) =>
                    apiItem.WebService.Id === layerDataItem.WebService.Id
                );

                return {
                  ...layerDataItem,
                  Properties: apiProperties
                    ? apiProperties.Properties
                    : layerDataItem.Properties,
                };
              });

              // Dispatch untuk memperbarui Redux store dengan data Properties baru
              dispatch(
                updateLayer({
                  title: activeLayer.UriTitle,
                  updatedData: { data: updatedData },
                })
              );
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, getPropertiesByGeom: false }));
    }
  };
  useImperativeHandle(ref, () => ({
    triggerAction: loadWebServiceGetPropertiesByGeom,
  }));

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

  const groupTitles = Array.from(
    new Set(
      layer
        .filter((item) => item.isActive)
        .flatMap((item) => item.data || [])
        // .map((item) => item.Group?.Title)
        .map((item) => item.WebService.Group.Title)
        .filter(
          (title): title is string =>
            typeof title === "string" && title.trim() !== ""
        )
        .sort((a, b) => a.localeCompare(b))
    )
  );

  return (
    isOpenModal && (
      <div
        className={cn([
          "absolute right-[1.5%] top-[20%] w-[40%] max-h-[75vh] bg-gray-gradient shadow-medium p-4 rounded-2xl",
        ])}
        ref={divRef}
      >
        <div
          className="absolute -top-3 -right-3 cursor-pointer bg-white p-1 rounded-lg shadow z-[99999999]"
          onClick={() => {
            dispatch(setIsOpenModalMap(false));
          }}
        >
          <HiOutlineX className="w-5 h-5 text-gray-700" />
        </div>
        <div className="h-fit max-h-[75vh] overflow-y-scroll">
          <div className="grid gap-y-6 h-fit pb-8">
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
                            // }
                          }}
                        />
                      );
                    })}
                </div>
              </DropdownLayer>
            </div>
            {/* line */}
            {groupTitles.length > 0 && (
              <div className="w-full h-[1px] bg-gray-50" />
            )}
            {/* category */}
            <div className="flex flex-wrap gap-2">
              {groupTitles.map((title, index) => (
                <div
                  key={index}
                  className={cn([
                    "px-4 py-2 rounded-lg",
                    groupTitleText === title
                      ? activeClassName
                      : inActiveClassName,
                    "border border-gray-300",
                  ])}
                  onClick={() => {
                    if (title) setGroupTitleText(title);
                  }}
                >
                  <p
                    className={cn([
                      "text-body-3",
                      groupTitleText === title ? "text-white" : "text-gray-700",
                      "font-medium",
                    ])}
                  >
                    {title}
                  </p>
                </div>
              ))}
            </div>

            {/* line */}
            {groupTitles.length > 0 && (
              <div className="w-full h-[1px] bg-gray-50" />
            )}

            {isLoading.getPropertiesByGeom || isLoading.byAllUriTitle ? (
              <SkeletonLoading className="h-10" />
            ) : (
              activeData.map((item, index) => {
                return (
                  item.data &&
                  item.data
                    .filter((dataItem, i, self) => {
                      // Ensure unique WebService.Group.Title and non-empty Properties
                      const { WebService, Properties } = dataItem;
                      return (
                        Properties.length > 0 && // Only include items with non-empty Properties
                        i ===
                          self.findIndex(
                            (otherItem) =>
                              otherItem.WebService.Group.Title ===
                              WebService.Group.Title
                          )
                      );
                    })
                    .map((dataItem, dataIndex) => {
                      const { Properties, WebService } = dataItem;

                      // Additional conditions to display based on your logic
                      const shouldDisplayGroup =
                        WebService.Group.Title === groupTitleText;
                      const shouldDisplayCategory =
                        WebService.GroupCategory === groupCategoryText;

                      const FourGrid =
                        Properties.length > 2 && Properties.length < 5;

                      return (
                        <ContainerInformation
                          title={WebService.Category}
                          key={dataIndex}
                        >
                          <ContainerData
                            containerClassName={cn([
                              "grid-cols-2",
                              FourGrid && "grid-cols-4",
                            ])}
                            data={Properties.map((property) => ({
                              title: property.Key,
                              description: property.Value,
                            }))}
                          />
                        </ContainerInformation>
                      );
                    })
                );
              })
            )}

            {/* perencanaan No. 1 */}
            {/* <ContainerInformation title="Perencanaan">
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
            </ContainerInformation> */}
            {/* pengelolaan No. 1 */}
            {/* <ContainerInformation title="Pengelolaan">
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
            </ContainerInformation> */}
          </div>
        </div>
      </div>
    )
  );
});

Sidebar.displayName = "Sidebar";
