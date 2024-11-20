// lib
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { HiOutlineX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// local
import {
  getAPITahunAll,
  getAPIWebServiceAll,
  getAPIWebServiceAllByUriTitle,
  getAPIWebServiceAllUriTitle,
  getAPIWebServiceGetPropertiesByGeom,
  getAPIWebServiceReferenceAll,
} from "@/api/responses";
import {
  Button,
  Chip,
  Dropdown,
  DropdownLayer,
  SkeletonLoading,
  SVGIcon,
  TimelineItem,
} from "@/components/atoms";
import { cn, copyToClipboard, formatNumber, OptionsType } from "@/lib";
import {
  DataWebserviceByGeom,
  PropertiesModel,
  UriTitleMapType,
} from "@/redux/Map/MapInteraktif";
import {
  setIsOpenModalMap,
  setLayer,
  toggleLayer,
  updateLayer,
} from "@/redux/Map/MapInteraktif/slice";
import { useAppSelector } from "@/redux/store";
import { ContainerData, ContainerInformation } from "@/components/molecules";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { hardcoded } from "./hardcoded";
import { WebServiceGroupModel, WebServiceModel } from "@/api/types";

interface IsLoadingType {
  allUriTitle: boolean;
  byAllUriTitle: boolean;
  getPropertiesByGeom: boolean;
  webServiceReferenceAll: boolean;
  tahun: boolean;
  webServiceAll: boolean;
}

const initIsLoadingType: IsLoadingType = {
  allUriTitle: false,
  byAllUriTitle: false,
  getPropertiesByGeom: false,
  webServiceReferenceAll: false,
  tahun: false,
  webServiceAll: false,
};

interface GroupTabProps {
  data?: WebServiceGroupModel[];
  selected?: WebServiceGroupModel | null;
}

interface GroupCategoryProps {
  value: string;
  isActive: boolean;
}

interface WebServicePropertiesModel {
  title: string;
  timeSeries: number;
  property: PropertiesModel[];
}
interface AllDataDataProps {
  category: string;
  groupCategory: string;
  properties: PropertiesModel[];
  webServiceProperties: WebServicePropertiesModel[];
}

interface AllDataProps {
  groupCategory: GroupCategoryProps[];
  data: AllDataDataProps[];
}

export const Sidebar = forwardRef((_, ref) => {
  // useState
  // const [groupTitleText, setGroupTitleText] = useState<string>("");
  const [groupCategoryText, setGroupCategoryText] = useState<string>("");
  const [jenisInformasiDropdown, setJenisInformasiDropdown] =
    useState<OptionsType | null>();
  const [tahunValue, setTahunValue] = useState<number | null>(null);
  const [jenisInformasi, setJenisInformasi] = useState<number | null>(null);
  const [groupTab, setGroupTab] = useState<GroupTabProps | null>();
  const [activeTabEvaluasi, setActiveTabEvaluasi] = useState<string>("Amdal");
  // useState - dropdown
  const [dropdownJenisInformasi, setDropdownJenisInformasi] = useState<
    OptionsType[]
  >([]);
  const [tahunData, setTahunData] = useState<OptionsType[]>([]);

  const [isCopied, setIsCopied] = useState<boolean>(false);
  // useState - All Data
  const [allData, setAllData] = useState<AllDataProps | null>(null);
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
  const alurData = hardcoded.find(
    (item) => item.groupTitle === "Alur & Status Tahapan"
  );
  const evaluasiData = hardcoded.find((item) => item.groupTitle === "Evaluasi");
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
      // if (location.latitude && location.longitude) {
      //   loadWebServiceGetPropertiesByGeom();
      // }
      setIsLoading((value) => ({ ...value, byAllUriTitle: false }));
    }
  };
  const loadWebServiceAll = async () => {
    try {
      setIsLoading((value) => ({ ...value, webServiceAll: true }));
      const { data, status } = await getAPIWebServiceAll();
      if (status === 200) {
        const groupData = getDistinctGroups(data.Data);
        const customOrder = ["Deteksi", "Laju", "Alur", "Evaluasi"];
        const orderData = groupData.sort((a, b) => {
          const indexA = customOrder.findIndex((order) =>
            a.Title.includes(order)
          );
          const indexB = customOrder.findIndex((order) =>
            b.Title.includes(order)
          );
          return indexA - indexB;
        });
        // console.log({ orderData });
        if (orderData) {
          setGroupTab((value) => ({
            ...value,
            selected: orderData[2],
            data: orderData,
          }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const loadWebServiceGetPropertiesByGeom = async () => {
    setIsLoading((value) => ({ ...value, getPropertiesByGeom: true }));

    try {
      if (location.latitude && location.longitude) {
        const codeGroup = groupTab?.selected?.Code;

        if (codeGroup) {
          const params = {
            latitude: location.latitude, // latitude
            longitude: location.longitude, // longitude
            codeGroup: codeGroup,
            ...(tahunValue !== null ? { startYear: tahunValue } : {}), // startYear
            ...(jenisInformasi !== null
              ? groupTab
                ? groupTab.selected
                  ? groupTab.selected.Title === "Alur & Status Tahapan"
                    ? { idWebServiceReference: jenisInformasi }
                    : {}
                  : {}
                : {}
              : {}), // idWebServiceReference
            // ...(jenisInformasi !== null
            //   ? { idWebServiceReference: jenisInformasi }
            //   : {}), // idWebServiceReference
          };

          const { data, status } = await getAPIWebServiceGetPropertiesByGeom(
            params
          );
          if (status === 200) {
            const resData = data.Data;

            const uniqueGroupCategories = Array.from(
              new Set(
                resData
                  .filter(
                    (filterItem) => filterItem.WebService.GroupCategory !== null
                  )
                  .map((item) => item.WebService.GroupCategory)
              )
            )
              .sort((a, b) => a.localeCompare(b))
              .map((category, index) => {
                return {
                  isActive: index === 1,
                  value: category,
                };
              });

            // Definisikan tipe data untuk item di groupedData

            // Inisialisasi initialGroupedData dengan tipe GroupedDataItem[]

            const initialGroupedData: AllDataDataProps[] = resData.map(
              (item) => {
                return {
                  category: item.WebService.Category,
                  properties: item.Properties,
                  groupCategory: item.WebService.GroupCategory,
                  webServiceProperties: [
                    {
                      title: item.WebService.Title,
                      property: item.Properties,
                      timeSeries: item.WebService.TimeSeries,
                    },
                  ],
                };
              }
            );

            // Definisikan groupedData dengan tipe GroupedDataItem[]
            const groupedData: AllDataDataProps[] = initialGroupedData.reduce(
              (acc, currentItem) => {
                // Cari atau buat grup berdasarkan `groupCategory`
                let groupCategoryGroup = acc.find(
                  (entry) => entry.groupCategory === currentItem.groupCategory
                );

                if (!groupCategoryGroup) {
                  groupCategoryGroup = {
                    groupCategory: currentItem.groupCategory,
                    category: currentItem.category,
                    properties: [],
                    webServiceProperties: [],
                  };
                  acc.push(groupCategoryGroup);
                }

                // Periksa apakah grup kategori ada dalam `groupCategory`
                const categoryGroup = acc.find(
                  (entry) =>
                    entry.groupCategory === currentItem.groupCategory &&
                    entry.category === currentItem.category
                );

                if (categoryGroup) {
                  // Jika grup kategori ada, gabungkan properties dan webServiceProperties
                  categoryGroup.properties.push(...currentItem.properties);
                  categoryGroup.webServiceProperties.push({
                    title: currentItem.webServiceProperties[0].title,
                    property: currentItem.webServiceProperties[0].property,
                    timeSeries: currentItem.webServiceProperties[0].timeSeries,
                  });
                } else {
                  // Jika grup kategori tidak ada, tambahkan sebagai grup baru
                  acc.push({
                    groupCategory: currentItem.groupCategory,
                    category: currentItem.category,
                    properties: [...currentItem.properties],
                    webServiceProperties: [
                      {
                        title: currentItem.webServiceProperties[0].title,
                        property: currentItem.webServiceProperties[0].property,
                        timeSeries:
                          currentItem.webServiceProperties[0].timeSeries,
                      },
                    ],
                  });
                }

                return acc;
              },
              [] as AllDataDataProps[]
            );

            setAllData({
              data: groupedData,
              groupCategory: uniqueGroupCategories,
            });

            console.log({
              data: groupedData,
              groupCategory: uniqueGroupCategories,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, getPropertiesByGeom: false }));
    }
  };

  // loadData - WebServiceReference
  const loadWebServiceReferenceAll = async () => {
    try {
      setIsLoading((value) => ({ ...value, webServiceReferenceAll: true }));
      const { data, status } = await getAPIWebServiceReferenceAll();
      if (status === 200) {
        if (data.Data.length > 0) {
          const newData: OptionsType[] = data.Data.map((item, index) => {
            return { label: item.Title, value: `${item.Id}` };
          });
          setDropdownJenisInformasi(newData);
          setJenisInformasiDropdown(newData[0]);
          setJenisInformasi(parseInt(newData[0].value));
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, webServiceReferenceAll: false }));
    }
  };
  // loadData - tahun
  const loadTahunAll = async () => {
    try {
      setIsLoading((value) => ({ ...value, tahun: true }));
      const { data, status } = await getAPITahunAll({ tahunType: "0" });
      if (status === 200) {
        const optionValue: OptionsType[] = data.Data.map((item) => {
          return { label: item.Year.toString(), value: item.Year.toString() };
        });
        setTahunData(optionValue);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading((value) => ({ ...value, tahun: false }));
    }
  };
  // useImperativeHandle
  useImperativeHandle(ref, () => ({
    triggerAction: loadWebServiceGetPropertiesByGeom,
  }));

  // handle
  const handleTabClick = (index: number) => {
    setAllData((prevState) => {
      if (!prevState) return prevState;

      return {
        ...prevState,
        groupCategory: prevState.groupCategory.map((item, idx) => ({
          ...item,
          isActive: idx === index,
        })),
      };
    });
  };

  // function
  const resetAlurStatusTahapanDropdown = () => {
    // if (jenisInformasi) setJenisInformasi(null);
    if (tahunValue) setTahunValue(null);
  };
  const getDistinctGroups = (
    data: WebServiceModel[]
  ): WebServiceGroupModel[] => {
    const groupMap = new Map<number, WebServiceGroupModel>();
    data.forEach((item) => {
      const group = item.Group;
      if (group.Title !== "Lainnya" && !groupMap.has(group.Id)) {
        groupMap.set(group.Id, group);
      }
    });

    return Array.from(groupMap.values()).sort((a, b) =>
      a.Title.localeCompare(b.Title)
    );
  };
  // useEffect
  useEffect(() => {
    loadWebServiceAllUriTitle();
    loadWebServiceReferenceAll();
    loadTahunAll();
    loadWebServiceAll();
  }, []);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    }
  }, [isCopied]);

  useEffect(() => {
    if (tahunValue !== null || jenisInformasi !== null) {
      loadWebServiceGetPropertiesByGeom();
    }
    // console.log({ tahunValue, jenisInformasi });
  }, [tahunValue, jenisInformasi]);

  useEffect(() => {
    if (
      groupTab &&
      groupTab.selected &&
      groupTab.selected.Title !== "Alur & Status Tahapan"
    ) {
      resetAlurStatusTahapanDropdown();
    }
  }, [groupTab?.selected]);
  useEffect(() => {
    if (groupTab && groupTab.selected) {
      setAllData(null);
      loadWebServiceGetPropertiesByGeom();
    }
  }, [groupTab?.selected]);

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
            {groupTab && groupTab.data && groupTab.data.length > 0 && (
              <div className="w-full h-[1px] bg-gray-50" />
            )}

            {/* category */}
            <div className="flex flex-wrap gap-2">
              {groupTab &&
                groupTab.data &&
                groupTab.data.map((item, index) => {
                  const selected = groupTab.selected?.Title;
                  // const {  } = item;
                  return (
                    <div
                      key={index}
                      className={cn([
                        "px-4 py-2 rounded-lg",
                        selected === item.Title
                          ? activeClassName
                          : inActiveClassName,
                        "border border-gray-300",
                        isLoading.getPropertiesByGeom &&
                          "opacity-80 cursor-default",
                      ])}
                      onClick={() => {
                        if (item && !isLoading.getPropertiesByGeom) {
                          setGroupTab((value) => ({
                            ...value,
                            selected: item,
                          }));
                        }
                      }}
                    >
                      <p
                        className={cn([
                          "text-body-3",
                          selected === item.Title
                            ? "text-white"
                            : "text-gray-700",
                          "font-medium",
                          isLoading.getPropertiesByGeom && " opacity-80",
                        ])}
                      >
                        {item.Title}
                      </p>
                    </div>
                  );
                })}
            </div>
            {/* line */}
            {groupTab && groupTab.data && groupTab.data.length > 0 && (
              <div className="w-full h-[1px] bg-gray-50" />
            )}
            {/* {
              groupTab && groupTab.selected
            } */}
            {/* TODO: Laju Perubahan  */}
            {groupTab && groupTab.selected && (
              <>
                {groupTab.selected.Title === "Laju Perubahan" ? (
                  isLoading.getPropertiesByGeom && allData === null ? (
                    <div className="flex justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-400 text-center" />
                    </div>
                  ) : (
                    <div>
                      <div className="rounded-lg flex w-full mb-6">
                        {allData &&
                          allData.groupCategory
                            .sort((a, b) => (a.value > b.value ? -1 : 1))
                            .map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cn([
                                    "w-full text-center",
                                    index === 0 && "rounded-l-lg",
                                    index + 1 ===
                                      allData.groupCategory.length &&
                                      "rounded-r-lg",
                                    "bg-white shadow-small border cursor-pointer",
                                    item.isActive &&
                                      "bg-primary text-white cursor-default",
                                  ])}
                                  onClick={() => {
                                    handleTabClick(index);
                                  }}
                                >
                                  <p
                                    className={cn([
                                      "py-[9px] px-4 text-body-3",
                                    ])}
                                  >
                                    {item.value}
                                  </p>
                                </div>
                              );
                            })}
                      </div>
                      {allData &&
                        allData.data
                          .filter((item) => {
                            const activeGroupCategory =
                              allData.groupCategory.find(
                                (category) => category.isActive
                              );
                            return (
                              activeGroupCategory &&
                              item.groupCategory === activeGroupCategory.value
                            );
                          })
                          .map((item, index) => {
                            const TwoGrid = item.properties.length === 2;
                            const ThreeGrid = item.properties.length === 3;
                            const FourGrid = item.properties.length > 3;

                            return (
                              <ContainerInformation
                                containerClassName={cn([index !== 0 && "mt-4"])}
                                title={item.category}
                                key={index}
                              >
                                <ContainerData
                                  isLoading={isLoading.getPropertiesByGeom}
                                  containerClassName={cn([
                                    "grid-cols-2",
                                    ThreeGrid && "grid-cols-3",
                                    // FourGrid && "grid-cols-4",
                                    item.category === "Deforestasi" &&
                                      "grid-cols-2",
                                  ])}
                                  //
                                  // descriptionClassName={cn([
                                  //   TwoGrid && "justify-self-end",
                                  // ])}
                                  // titleClassName={cn(["justify-self-end"])}
                                  //
                                  data={item.properties.map(
                                    (property, indexProperty) => {
                                      if (item.category === "Deforestasi") {
                                        return {
                                          dataClassName: `${cn([
                                            item.category === "Deforestasi" &&
                                              "col-span-1",
                                          ])}`,
                                          title:
                                            indexProperty === 0 ||
                                            indexProperty === 1
                                              ? property.Key
                                              : "",
                                          description:
                                            property.Value === ""
                                              ? "-"
                                              : formatNumber(property.Value),
                                        };
                                      } else {
                                        return {
                                          title: property.Key,
                                          description:
                                            property.Value === ""
                                              ? "-"
                                              : formatNumber(property.Value),
                                        };
                                      }
                                    }
                                  )}
                                />
                              </ContainerInformation>
                            );
                          })}
                    </div>
                  )
                ) : null}

                {/* TODO: Deteksi Perencanaan & Pengelolaan  */}
                {groupTab.selected.Title ===
                "Deteksi Perencanaan & Pengelolaan" ? (
                  isLoading.getPropertiesByGeom && allData === null ? (
                    <div className="flex justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-400 text-center" />
                    </div>
                  ) : (
                    <div>
                      {allData &&
                        allData.data
                          .filter(
                            (filterItem) => filterItem.groupCategory === null
                          )
                          .map((i, indexKey) => {
                            return (
                              <div key={indexKey}>
                                <p className="text-body-2 text-gray-900 font-medium mb-6">
                                  {i.category}
                                </p>
                                <div>
                                  {i.webServiceProperties.map((item, index) => {
                                    return (
                                      <ContainerInformation
                                        key={index}
                                        title={item.title}
                                        secondTitle={`Tahun ${item.timeSeries}`}
                                        containerClassName={cn([
                                          index !== 0 && "mt-4",
                                        ])}
                                      >
                                        <ContainerData
                                          isLoading={
                                            isLoading.getPropertiesByGeom
                                          }
                                          containerClassName={cn([
                                            "grid-cols-2",
                                          ])}
                                          data={item.property.map(
                                            (property, indexProperty) => {
                                              return {
                                                title: property.Key,
                                                description:
                                                  property.Value === ""
                                                    ? "-"
                                                    : formatNumber(
                                                        property.Value
                                                      ),
                                              };
                                            }
                                          )}
                                        />
                                      </ContainerInformation>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      <div className="rounded-lg flex w-full mb-6 mt-6">
                        {allData &&
                          allData.groupCategory
                            .sort((a, b) => (a.value > b.value ? -1 : 1))
                            .map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cn([
                                    "w-full text-center",
                                    index === 0 && "rounded-l-lg",
                                    index + 1 ===
                                      allData.groupCategory.length &&
                                      "rounded-r-lg",
                                    "bg-white shadow-small border cursor-pointer",
                                    item.isActive &&
                                      "bg-primary text-white cursor-default",
                                  ])}
                                  onClick={() => {
                                    handleTabClick(index);
                                  }}
                                >
                                  <p
                                    className={cn([
                                      "py-[9px] px-4 text-body-3",
                                    ])}
                                  >
                                    {item.value}
                                  </p>
                                </div>
                              );
                            })}
                      </div>
                      {allData &&
                        allData.data
                          .filter((item) => {
                            const activeGroupCategory =
                              allData.groupCategory.find(
                                (category) => category.isActive
                              );
                            return (
                              activeGroupCategory &&
                              item.groupCategory === activeGroupCategory.value
                            );
                          })
                          .map((item, index) => {
                            const TwoGrid = item.properties.length === 2;
                            const ThreeGrid = item.properties.length === 3;
                            const FourGrid = item.properties.length > 3;

                            return (
                              <ContainerInformation
                                containerClassName={cn([index !== 0 && "mt-4"])}
                                title={item.category}
                                key={index}
                              >
                                <ContainerData
                                  isLoading={isLoading.getPropertiesByGeom}
                                  containerClassName={cn([
                                    "grid-cols-2",
                                    ThreeGrid && "grid-cols-3",
                                    // FourGrid && "grid-cols-4",
                                    item.category === "Deforestasi" &&
                                      "grid-cols-2",
                                  ])}
                                  //
                                  // descriptionClassName={cn([
                                  //   TwoGrid && "justify-self-end",
                                  // ])}
                                  // titleClassName={cn(["justify-self-end"])}
                                  //
                                  data={item.properties.map(
                                    (property, indexProperty) => {
                                      if (item.category === "Deforestasi") {
                                        return {
                                          dataClassName: `${cn([
                                            item.category === "Deforestasi" &&
                                              "col-span-1",
                                          ])}`,
                                          title:
                                            indexProperty === 0 ||
                                            indexProperty === 1
                                              ? property.Key
                                              : "",
                                          description:
                                            property.Value === ""
                                              ? "-"
                                              : formatNumber(property.Value),
                                        };
                                      } else {
                                        return {
                                          title: property.Key,
                                          description:
                                            property.Value === ""
                                              ? "-"
                                              : formatNumber(property.Value),
                                        };
                                      }
                                    }
                                  )}
                                />
                              </ContainerInformation>
                            );
                          })}
                    </div>
                  )
                ) : null}
                {/* TODO: Alur & Status Tahapan  */}
                {groupTab.selected.Title === "Alur & Status Tahapan" ? (
                  <>
                    {tahunData.length > 0 && (
                      <Dropdown
                        label="Tahun"
                        title="Pilih Tahun"
                        items={tahunData}
                        // autoSelectFirstItem={true}
                        onSelect={(selected) => {
                          const data = selected[0];
                          if (data) {
                            setTahunValue(parseInt(data.value));
                          }
                        }}
                      />
                    )}
                    {dropdownJenisInformasi.length > 0 && (
                      <Dropdown
                        items={dropdownJenisInformasi}
                        label="Jenis Informasi"
                        title="Jenis Informasi"
                        defaultSelected={[dropdownJenisInformasi[0].value]}
                        onSelect={(e) => {
                          if (e.length > 0) {
                            setJenisInformasiDropdown(e[0]);
                            setJenisInformasi(parseInt(e[0].value));
                          }
                        }}
                      />
                    )}
                    {/* TODO: Persetujuan */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label === "Persetujuan" && (
                        <div>
                          <div className="rounded-lg flex w-full">
                            {/* {allData &&
                              allData.groupCategory
                                .sort((a, b) => (a.value > b.value ? -1 : 1))
                                .map((item, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className={cn([
                                        "w-full text-center",
                                        index === 0 && "rounded-l-lg",
                                        index + 1 ===
                                          allData.groupCategory.length &&
                                          "rounded-r-lg",
                                        "bg-white shadow-small border cursor-pointer",
                                        item.isActive &&
                                          "bg-primary text-white cursor-default",
                                      ])}
                                      onClick={() => {
                                        handleTabClick(index);
                                      }}
                                    >
                                      <p
                                        className={cn([
                                          "py-[9px] px-4 text-body-3",
                                        ])}
                                      >
                                        {item.value}
                                      </p>
                                    </div>
                                  );
                                })} */}
                          </div>
                          {allData &&
                            allData.data.map((item, index) => {
                              const TwoGrid = item.properties.length === 2;
                              const ThreeGrid = item.properties.length === 3;
                              const FourGrid = item.properties.length > 3;

                              return (
                                <ContainerInformation
                                  containerClassName={cn([
                                    index !== 0 && "mt-4",
                                  ])}
                                  title={item.category}
                                  key={index}
                                >
                                  <ContainerData
                                    isLoading={isLoading.getPropertiesByGeom}
                                    containerClassName={cn([
                                      "grid-cols-2",
                                      ThreeGrid && "grid-cols-3",
                                      // FourGrid && "grid-cols-4",
                                      item.category === "Deforestasi" &&
                                        "grid-cols-2",
                                    ])}
                                    //
                                    // descriptionClassName={cn([
                                    //   TwoGrid && "justify-self-end",
                                    // ])}
                                    // titleClassName={cn(["justify-self-end"])}
                                    //
                                    data={item.properties.map(
                                      (property, indexProperty) => {
                                        if (item.category === "Deforestasi") {
                                          return {
                                            dataClassName: `${cn([
                                              item.category === "Deforestasi" &&
                                                "col-span-1",
                                            ])}`,
                                            title:
                                              indexProperty === 0 ||
                                              indexProperty === 1
                                                ? property.Key
                                                : "",
                                            description:
                                              property.Value === ""
                                                ? "-"
                                                : formatNumber(property.Value),
                                          };
                                        } else {
                                          return {
                                            title: property.Key,
                                            description:
                                              property.Value === ""
                                                ? "-"
                                                : formatNumber(property.Value),
                                          };
                                        }
                                      }
                                    )}
                                  />
                                </ContainerInformation>
                              );
                            })}
                        </div>
                      )}
                    {/* TODO: Daya Dukung Dan Tampung */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label ===
                        "Daya Dukung & Tampung" && (
                        <div className="">
                          {allData &&
                            allData.data
                              .filter(
                                (filterItem) =>
                                  filterItem.groupCategory === null
                              )
                              .map((i, indexKey) => {
                                return (
                                  <div key={indexKey}>
                                    <div>
                                      {i.webServiceProperties.map(
                                        (item, index) => {
                                          return (
                                            <ContainerInformation
                                              key={index}
                                              title={item.title}
                                              containerClassName={cn([
                                                indexKey !== 0 && "mt-4",
                                              ])}
                                            >
                                              <ContainerData
                                                isLoading={
                                                  isLoading.getPropertiesByGeom
                                                }
                                                containerClassName={cn([
                                                  "grid-cols-2",
                                                ])}
                                                data={item.property.map(
                                                  (property, indexProperty) => {
                                                    return {
                                                      title: property.Key,
                                                      description:
                                                        property.Value === ""
                                                          ? "-"
                                                          : formatNumber(
                                                              property.Value
                                                            ),
                                                    };
                                                  }
                                                )}
                                              />
                                            </ContainerInformation>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                    {/* TODO: Amdal */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label === "Amdal" && (
                        <div className="">
                          {allData &&
                            allData.data
                              .filter(
                                (filterItem) =>
                                  filterItem.groupCategory === null
                              )
                              .map((i, indexKey) => {
                                return (
                                  <div key={indexKey}>
                                    <div>
                                      {i.webServiceProperties.map(
                                        (item, index) => {
                                          return (
                                            <ContainerInformation
                                              key={index}
                                              title={item.title}
                                              containerClassName={cn([
                                                indexKey !== 0 && "mt-4",
                                              ])}
                                            >
                                              <ContainerData
                                                isLoading={
                                                  isLoading.getPropertiesByGeom
                                                }
                                                containerClassName={cn([
                                                  "grid-cols-2",
                                                ])}
                                                data={item.property.map(
                                                  (property, indexProperty) => {
                                                    return {
                                                      title: property.Key,
                                                      description:
                                                        property.Value === ""
                                                          ? "-"
                                                          : formatNumber(
                                                              property.Value
                                                            ),
                                                    };
                                                  }
                                                )}
                                              />
                                            </ContainerInformation>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                    {/* TODO: UKL-UPL */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label === "UKL-UPL" && (
                        <div className="">
                          {allData &&
                            allData.data
                              .filter(
                                (filterItem) =>
                                  filterItem.groupCategory === null
                              )
                              .map((i, indexKey) => {
                                return (
                                  <div key={indexKey}>
                                    <div>
                                      {i.webServiceProperties.map(
                                        (item, index) => {
                                          return (
                                            <ContainerInformation
                                              key={index}
                                              title={item.title}
                                              containerClassName={cn([
                                                indexKey !== 0 && "mt-4",
                                              ])}
                                            >
                                              <ContainerData
                                                isLoading={
                                                  isLoading.getPropertiesByGeom
                                                }
                                                containerClassName={cn([
                                                  "grid-cols-2",
                                                ])}
                                                data={item.property.map(
                                                  (property, indexProperty) => {
                                                    return {
                                                      title: property.Key,
                                                      description:
                                                        property.Value === ""
                                                          ? "-"
                                                          : formatNumber(
                                                              property.Value
                                                            ),
                                                    };
                                                  }
                                                )}
                                              />
                                            </ContainerInformation>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                    {/* TODO: Permohonan */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label === "Permohonan" && (
                        <div className="">
                          {allData &&
                            allData.data
                              .filter(
                                (filterItem) =>
                                  filterItem.groupCategory === null
                              )
                              .map((i, indexKey) => {
                                return (
                                  <div key={indexKey}>
                                    <div>
                                      {i.webServiceProperties.map(
                                        (item, index) => {
                                          return (
                                            <ContainerInformation
                                              key={index}
                                              title={item.title}
                                              containerClassName={cn([
                                                indexKey !== 0 && "mt-4",
                                              ])}
                                            >
                                              <ContainerData
                                                isLoading={
                                                  isLoading.getPropertiesByGeom
                                                }
                                                containerClassName={cn([
                                                  "grid-cols-2",
                                                ])}
                                                data={item.property.map(
                                                  (property, indexProperty) => {
                                                    return {
                                                      title: property.Key,
                                                      description:
                                                        property.Value === ""
                                                          ? "-"
                                                          : formatNumber(
                                                              property.Value
                                                            ),
                                                    };
                                                  }
                                                )}
                                              />
                                            </ContainerInformation>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                    {/* TODO: Pengukuhan, Penetapan & Pelepasan */}
                    {jenisInformasiDropdown &&
                      jenisInformasiDropdown.label ===
                        "Pengukuhan,Penetapan & Pelepasan" && (
                        <div className="">
                          {allData &&
                            allData.data
                              .filter(
                                (filterItem) =>
                                  filterItem.groupCategory === null
                              )
                              .map((i, indexKey) => {
                                return (
                                  <div key={indexKey}>
                                    <div>
                                      {i.webServiceProperties.map(
                                        (item, index) => {
                                          return (
                                            <ContainerInformation
                                              key={index}
                                              title={item.title}
                                              containerClassName={cn([
                                                indexKey !== 0 && "mt-4",
                                              ])}
                                            >
                                              <ContainerData
                                                isLoading={
                                                  isLoading.getPropertiesByGeom
                                                }
                                                containerClassName={cn([
                                                  "grid-cols-2",
                                                ])}
                                                data={item.property.map(
                                                  (property, indexProperty) => {
                                                    return {
                                                      title: property.Key,
                                                      description:
                                                        property.Value === ""
                                                          ? "-"
                                                          : formatNumber(
                                                              property.Value
                                                            ),
                                                    };
                                                  }
                                                )}
                                              />
                                            </ContainerInformation>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      )}
                  </>
                ) : null}
              </>
            )}
            {/* TODO: Alur & Status Tahapan  */}

            {/* {groupTitleText === "Alur & Status Tahapan" &&
              tahunData.length > 0 && (
                <Dropdown
                  label="Tahun"
                  title="Pilih Tahun"
                  items={tahunData}
                  // autoSelectFirstItem={true}
                  onSelect={(selected) => {
                    const data = selected[0];
                    if (data) {
                      setTahunValue(parseInt(data.value));
                    }
                  }}
                />
              )} */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              dropdownJenisInformasi.length > 0 && (
                <Dropdown
                  items={dropdownJenisInformasi}
                  label="Jenis Informasi"
                  title="Jenis Informasi"
                  onSelect={(e) => {
                    if (e.length > 0) {
                      setJenisInformasiDropdown(e[0]);
                      setJenisInformasi(parseInt(e[0].value));
                    }
                  }}
                />
              )} */}

            {/* TODO: Persetujuan */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label === "Persetujuan" && (
                <div>
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.PPHTR && (
                      <ContainerInformation
                        title={alurData.data.persetujuan.PPHTR.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.PPHTR.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.persetujuan.PPHTR.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.PPHD && (
                      <ContainerInformation
                        containerClassName="mt-4"
                        title={alurData.data.persetujuan.PPHD.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.PPHD.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.PKK && (
                      <ContainerInformation
                        containerClassName="mt-4"
                        title={alurData.data.persetujuan.PKK.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.PKK.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.persetujuan.PKK.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.PPKHN && (
                      <ContainerInformation
                        containerClassName="mt-4"
                        title={alurData.data.persetujuan.PPKHN.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.PPKHN.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.persetujuan.PPKHN.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.PPKHEksporasi && (
                      <ContainerInformation
                        containerClassName="mt-4"
                        title={alurData.data.persetujuan.PPKHEksporasi.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.PPKHEksporasi.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.persetujuan.PPKHEksporasi.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                  {alurData &&
                    alurData.data &&
                    alurData.data.persetujuan &&
                    alurData.data.persetujuan.NonTambang && (
                      <ContainerInformation
                        containerClassName="mt-4"
                        title={alurData.data.persetujuan.NonTambang.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.persetujuan.NonTambang.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.persetujuan.NonTambang.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    )}
                </div>
              )} */}
            {/* TODO: Daya Dukung Dan Tampung */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label === "Daya Dukung & Tampung" && (
                <div className="">
                  {alurData &&
                    alurData.data &&
                    alurData.data.dayaDukungDanTampung && (
                      <div>
                        <ContainerInformation
                          title={
                            alurData.data.dayaDukungDanTampung.dayaDukung.title
                          }
                        >
                          <ContainerData
                            containerClassName="grid-cols-2"
                            data={alurData.data.dayaDukungDanTampung.dayaDukung.data1.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.dayaDukungDanTampung.dayaDukung.data2.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                        </ContainerInformation>
                        <ContainerInformation
                          containerClassName="mt-4"
                          title={
                            alurData.data.dayaDukungDanTampung.dayaTampung.title
                          }
                        >
                          <ContainerData
                            containerClassName="grid-cols-2"
                            data={alurData.data.dayaDukungDanTampung.dayaTampung.data1.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.dayaDukungDanTampung.dayaTampung.data2.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                        </ContainerInformation>
                      </div>
                    )}
                </div>
              )} */}
            {/* TODO: Amdal */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label === "Amdal" && (
                <div className="">
                  {alurData && alurData.data && alurData.data.amdal && (
                    <div>
                      <ContainerInformation
                        title={alurData.data.amdal.amdal.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.amdal.amdal.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.amdal.amdal.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    </div>
                  )}
                </div>
              )} */}
            {/* TODO: UKL-UPL */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label === "UKL-UPL" && (
                <div className="">
                  {alurData && alurData.data && alurData.data.uklUpl && (
                    <div>
                      <ContainerInformation
                        title={alurData.data.uklUpl.uklUpl.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.uklUpl.uklUpl.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.uklUpl.uklUpl.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    </div>
                  )}
                </div>
              )} */}
            {/* TODO: Permohonan */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label === "Permohonan" && (
                <div className="">
                  {alurData && alurData.data && alurData.data.permohonan && (
                    <div>
                      <ContainerInformation
                        title={alurData.data.permohonan.permohonan.title}
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={alurData.data.permohonan.permohonan.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.permohonan.permohonan.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={alurData.data.permohonan.permohonan.data3.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                    </div>
                  )}
                </div>
              )} */}
            {/* TODO: Pengukuhan, Penetapan & Pelepasan */}
            {/* {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown &&
              jenisInformasiDropdown.label ===
                "Pengukuhan, Penetapan & Pelepasan" && (
                <div className="">
                  {alurData &&
                    alurData.data &&
                    alurData.data.pengukuhanPenetapanDanPelepasan && (
                      <div>
                        <ContainerInformation
                          title={
                            alurData.data.pengukuhanPenetapanDanPelepasan
                              .penetapan.title
                          }
                        >
                          <ContainerData
                            containerClassName="grid-cols-2"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.penetapan.data1.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.penetapan.data2.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.permohonan.permohonan.data3.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                        </ContainerInformation>
                        <ContainerInformation
                          containerClassName="mt-4"
                          title={
                            alurData.data.pengukuhanPenetapanDanPelepasan
                              .pengukuhan.title
                          }
                        >
                          <ContainerData
                            containerClassName="grid-cols-2"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.pengukuhan.data1.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.pengukuhan.data2.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                        </ContainerInformation>
                        <ContainerInformation
                          containerClassName="mt-4"
                          title={
                            alurData.data.pengukuhanPenetapanDanPelepasan
                              .pelepasan.title
                          }
                        >
                          <ContainerData
                            containerClassName="grid-cols-2"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.pelepasan.data1.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.pelepasan.data2.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                          <ContainerData
                            containerClassName="grid-cols-2 mt-4"
                            data={alurData.data.pengukuhanPenetapanDanPelepasan.pelepasan.data3.map(
                              (item, index) => {
                                return {
                                  description: item.value,
                                  title: item.title,
                                };
                              }
                            )}
                          />
                        </ContainerInformation>
                      </div>
                    )}
                </div>
              )} */}
            {/* TODO: Evaluasi */}
            {/* {groupTitleText === "Evaluasi" && (
              <div>
                <div className="rounded-lg flex w-full mb-6">
                  {evaluasiData &&
                    evaluasiData.data &&
                    evaluasiData.data.tab &&
                    evaluasiData.data.tab.map((item, index) => {
                      const length = evaluasiData.data.tab?.length;
                      return (
                        <div
                          key={index}
                          className={cn([
                            index === 0 && "rounded-l-lg",
                            index + 1 == length && "rounded-r-lg",
                            "bg-white shadow-small border cursor-pointer",
                            activeTabEvaluasi === item &&
                              "bg-primary text-white cursor-default",
                          ])}
                          onClick={() => {
                            setActiveTabEvaluasi(item);
                          }}
                        >
                          <p className={cn(["py-[9px] px-4 text-body-3"])}>
                            {item}
                          </p>
                        </div>
                      );
                    })}
                </div>
                {evaluasiData &&
                  evaluasiData.data &&
                  evaluasiData.data.noTitle && (
                    <div>
                      <ContainerInformation
                        // TODO: No Title

                        title=""
                      >
                        <ContainerData
                          containerClassName="grid-cols-2"
                          data={evaluasiData.data.noTitle.data1.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                        <ContainerData
                          containerClassName="grid-cols-2 mt-4"
                          data={evaluasiData.data.noTitle.data2.map(
                            (item, index) => {
                              return {
                                description: item.value,
                                title: item.title,
                              };
                            }
                          )}
                        />
                      </ContainerInformation>
                      <ContainerInformation
                        // TODO: Dokumen

                        containerClassName="mt-4"
                        childrenClassName="grid gap-y-4 bg-white p-4 rounded-lg"
                        title={evaluasiData.data.dokumen.title}
                      >
                        {evaluasiData.data.dokumen.data1.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <p className="text-body-3 text-gray-800 font-semibold">
                                {item}
                              </p>
                              <Button label="Lihat Dokumen" variant="outline" />
                            </div>
                          );
                        })}
                      </ContainerInformation>
                      <ContainerInformation
                        // TODO: Status Tracking
                        containerClassName="mt-4"
                        childrenClassName=" bg-white p-4 rounded-lg space-y-6 "
                        title={evaluasiData.data.statusTracking.title}
                      >
                        {evaluasiData.data.statusTracking.data1.map(
                          (item, index) => {
                            const length =
                              evaluasiData.data.statusTracking?.data1.length;
                            return (
                              <TimelineItem
                                key={index}
                                title={item.title}
                                timestamp={item.value}
                                isLast={index + 1 === length}
                              />
                            );
                          }
                        )}
                      </ContainerInformation>
                    </div>
                  )}
              </div>
            )} */}
          </div>
        </div>
      </div>
    )
  );
});

Sidebar.displayName = "Sidebar";
