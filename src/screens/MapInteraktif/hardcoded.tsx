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
import {
  cn,
  COOKIE_TOKEN,
  copyToClipboard,
  decryptText,
  OptionsType,
} from "@/lib";
import {
  Chip,
  Dropdown,
  DropdownLayer,
  SkeletonLoading,
  SVGIcon,
} from "@/components/atoms";

// asset
import LocationCrosshairsSVG from "@/icons/location-crosshairs.svg";
import { ContainerData, ContainerInformation } from "@/components/molecules";
import { FloatNavbar } from "@/components/templates";
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

export const MapInteraktifScreenHardCoded: FC = () => {
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
  const hardcoded = [
    {
      groupTitle: "Deteksi Perencanaan & Pengelolaan",
      data: null,
    },
    {
      groupTitle: "Laju Perubahan",
      data: null,
    },
    {
      groupTitle: "Alur & Status Tahapan",
      data: {
        jenisInformasi: [
          "Persetujuan",
          "Daya Dukung & Tampung",
          "Amdal",
          "UKL-UPL",
          "Permohonan",
          "Pengukuhan, Penetapan & Pelepasan",
        ],
        // Persetujuan
        persetujuan: {
          tab: [
            "PPHTR",
            "PPHD",
            "PKK",
            "PPKHN",
            "PPKH Eksplorasi",
            "Non Tambang",
          ],
          PPHTR: {
            title: "Persetujuan Pengelolaan Hutan Tanaman Rakyat (PPHTR)",
            data1: [
              {
                title: "Nama",
                value: "KTH AEK NATONGGI",
              },
              {
                title: "No.SK",
                value: "No.SK",
              },
            ],
            data2: [
              {
                title: "Tanggal SK",
                value: "02/02/2024",
              },
              {
                title: "Luas",
                value: "500.64 Ha",
              },
            ],
          },
          PPHD: {
            title: "Persetujuan Pengelolaan Hutan Desa (PPHD)",
            data1: [
              {
                title: "Nama Lembaga",
                value: "LPHD BANTAN AIR",
              },
              {
                title: "Luas",
                value: "522.614/2024",
              },
            ],
          },
          PKK: {
            title: "Persetujuan Kemitraan Kehutanan (PKK)",
            data1: [
              {
                title: "Nama Kelompok",
                value: "KTH Batu berdiri",
              },
              {
                title: "Nama Pemegang",
                value: "522.614/2024",
              },
            ],
            data2: [
              {
                title: "No SK",
                value: "SK.6466/MELHKPSKL/PKPS/PSL.0/8/2022",
              },
              {
                title: "Tanggal SK",
                value: "12/02/2022",
              },
              {
                title: "Luas",
                value: "345,44 Ha",
              },
            ],
          },
          PPKHN: {
            title:
              "Pengelolaan Pembangunan Kehutanan dan Lingkungan Hidup (PPKHN)",
            data1: [
              {
                title: "Nama Unit",
                value: "Woyla Aceh Mineral, PT",
              },
              {
                title: "No SK",
                value: "522.614/2024",
              },
            ],
            data2: [
              {
                title: "Tanggal SK",
                value: "06/09/2022",
              },
              {
                title: "Luas",
                value: "559,31 Ha",
              },
            ],
          },
          PPKHEksporasi: {
            title: "Persetujuan Penggunaan Kawasan Hutan Eksplorasi",
            data1: [
              {
                title: "Nama Unit",
                value: "Woyla Aceh Mineral, PT",
              },
              {
                title: "No SK",
                value: "522.614/2024",
              },
            ],
            data2: [
              {
                title: "Tanggal SK",
                value: "06/09/2022",
              },
              {
                title: "Luas",
                value: "559,31 Ha",
              },
            ],
          },
          NonTambang: {
            title:
              "Persetujuan Penggunaan Kawasan Hutan Operasi Produksi/Non Tambang",
            data1: [
              {
                title: "Nama Unit",
                value: "PLN (Persero), PT",
              },
              {
                title: "No SK",
                value: "522.614/2024",
              },
            ],
            data2: [
              {
                title: "Tanggal SK",
                value: "06/09/2022",
              },
              {
                title: "Luas",
                value: "559,31 Ha",
              },
            ],
          },
        },
        // Daya Dukung & Tampung
        dayaDukungDanTampung: {
          dayaDukung: {
            title: "Daya Dukung",
            data1: [
              {
                title: "Nama Unit",
                value: "CA Batukahu III",
              },
              {
                title: "Penunjukan",
                value: "433/Kpts-IV/1999 15 Juni 1999",
              },
            ],
            data2: [
              {
                title: "SK Penetapan",
                value: "SK.2847/Menhut-VII/KUH/2014 16 April 2014",
              },
            ],
          },
          dayaTampung: {
            title: "Daya Tampung",
            data1: [
              {
                title: "Ketersediaan Air",
                value: "287,120.90",
              },
              {
                title: "Kebutuhan Air Domistik",
                value: "0",
              },
            ],
            data2: [
              {
                title: "Kebutuhan Air untuk Lahan",
                value: "0",
              },
              {
                title: "Ambang Batas Populasi",
                value: "359",
              },
              {
                title: "Status",
                value: "Terlampaui",
              },
            ],
          },
        },
        // Amdal
        amdal: {
          amdal: {
            title: "Analisis Mengenai Dampak Lingkungan (AMDAL)",
            data1: [
              {
                title: "Nama Unit",
                value: "PT Antam Tbk",
              },
              {
                title: "SK",
                value: "433/Kpts-IV/1999 15 Juni 1999",
              },
            ],
            data2: [
              {
                title: "Luas",
                value: "500 Ha",
              },
            ],
          },
        },
        // UKL-UPL
        uklUpl: {
          uklUpl: {
            title:
              "Upaya Pengelolaan Lingkungan Hidup & Upaya Pemantauan Lingkungan Hidup (UKL-UPL)",
            data1: [
              {
                title: "Nama Unit",
                value: "PT Antam Tbk",
              },
              {
                title: "SK",
                value: "433/Kpts-IV/1999 15 Juni 1999",
              },
            ],
            data2: [
              {
                title: "Luas",
                value: "500 Ha",
              },
            ],
          },
        },
        // Permohonan
        permohonan: {
          permohonan: {
            title: "Pemohon",
            data1: [
              {
                title: "Nama Pemohon",
                value: "Maulana Ibrahim",
              },
              {
                title: "Jenis Permohonan",
                value: "permohonan Persetujuan penggunaan kawasan hutan",
              },
            ],
            data2: [
              {
                title: "Tanggal Permohonan",
                value: "20 Oktober 2024",
              },
              {
                title: "No SK",
                value: "SK.203/2901",
              },
            ],
            data3: [
              {
                title: "Status Permohonan",
                value: "Disetujui",
              },
            ],
          },
        },
        // Pengukuhan, Penetapan & Pelepasan
        pengukuhanPenetapanDanPelepasan: {
          penetapan: {
            title: "Penetapan",
            data1: [
              {
                title: "Nama",
                value: "PT Antam Tbk",
              },
              {
                title: "Penetapan",
                value: "dbkhk.pktl_ppkh.PNTPNKWSHUTAN_AR_50_K_042023",
              },
              {
                title: "No.SK",
                value: "SK.203/2901",
              },
            ],
            data2: [
              {
                title: "Tanggal SK Kawasan Hutan",
                value: "12/02/2024",
              },
              {
                title: "Kab/Kota",
                value: "Kalimalang",
              },
            ],
          },
          pengukuhan: {
            title: "Pengukuhan",
            data1: [
              {
                title: "Nama",
                value: "PT Antam Tbk",
              },
              {
                title: "Penetapan",
                value: "dbkhk.pktl_ppkh.PNTPNKWSHUTAN_AR_50_K_042023",
              },
              {
                title: "No.SK",
                value: "SK.203/2901",
              },
            ],
            data2: [
              {
                title: "Tanggal SK Kawasan Hutan",
                value: "12/02/2024",
              },
              {
                title: "Kab/Kota",
                value: "Kalimalang",
              },
            ],
          },
          pelepasan: {
            title: "Pelepasan",
            data1: [
              {
                title: "Nama Pelepasan",
                value: "Hutan Primer",
              },
              {
                title: "No.SK",
                value: "SK.203/2901",
              },
            ],
            data2: [
              {
                title: "Jenis Pelepasan",
                value: "1",
              },
              {
                title: "No.SK",
                value: "SK.203/2901",
              },
            ],
            data3: [
              {
                title: "Tanggal SK.Pelepasan & Surat Penegasan",
                value: "",
              },
              {
                title: "Luas SK & Surat Penegasan",
                value: "",
              },
            ],
          },
        },
      },
    },
    {
      groupTitle: "Evaluasi",
      data: null,
    },
  ];

  // useState
  const [groupTitleText, setGroupTitleText] = useState<string>(
    "Alur & Status Tahapan"
  );
  const [groupCategoryText, setGroupCategoryText] = useState<string>("");
  const [jenisInformasiDropdown, setJenisInformasiDropdown] =
    useState<string>("Persetujuan");
  const [activeTabPersetujuan, setActiveTabPersetujuan] =
    useState<string>("PPHTR");

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
  const alurData = hardcoded.find(
    (item) => item.groupTitle === "Alur & Status Tahapan"
  );
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

  // Informasi Wilayah: https://geoportal.menlhk.go.id/server/rest/services/SIGAP_Interaktif/Adm_KabKot_Sept2023/MapServer
  // Perencanaan:
  /*
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/4 
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/3
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/1 
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/6 
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/5 
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/2 
  []https://nfms.menlhk.go.id:8443/arcgis/rest/services/dss/rktn/MapServer/0 
  */
  // Reforestasi: https://geoportal.menlhk.go.id/server/rest/services/Time_Series/REF_2019_2020/MapServer
  // Deforestasi: https://geoportal.menlhk.go.id/server/rest/services/Time_Series/DEF_2020_2021/MapServer
  // KPHK:
  /*
  []https://geoportal.menlhk.go.id/server/rest/services/dgcfrhmh/KPH_AR_250K/MapServer/2
  */

  // Wilayah Pengukuran Kinerja: https://sigap.menlhk.go.id/server/rest/services/KLHK/M_Wilayah_Pengukuran_Kinerja_REDD/MapServer
  // Penutupan Lahan: https://geoportal.menlhk.go.id/server/rest/services/Time_Series/PL_1990/MapServer
  // Pengelolaan: https://geoportal.menlhk.go.id/server/rest/services/jbcdsabhx/PPKH_AR_50K/MapServer/2
  // Kawasan Hutan: https://geoportal.menlhk.go.id/server/rest/services/SIGAP_Interaktif/Kawasan_Hutan/MapServer

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
            <div className="w-full h-[1px] bg-gray-50" />

            {/* category */}
            <div className="flex flex-wrap gap-2">
              {hardcoded.map((item, index) => {
                const { groupTitle } = item;
                return (
                  <div
                    key={index}
                    className={cn([
                      "px-4 py-2 rounded-lg",
                      groupTitleText === groupTitle
                        ? activeClassName
                        : inActiveClassName,
                      "border border-gray-300",
                    ])}
                    onClick={() => {
                      if (groupTitle) setGroupTitleText(groupTitle);
                    }}
                  >
                    <p
                      className={cn([
                        "text-body-3",
                        groupTitleText === groupTitle
                          ? "text-white"
                          : "text-gray-700",
                        "font-medium",
                      ])}
                    >
                      {groupTitle}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* line */}
            <div className="w-full h-[1px] bg-gray-50" />

            {(groupTitleText === "Laju Perubahan" &&
              isLoading.getPropertiesByGeom) ||
            isLoading.byAllUriTitle ? (
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
            {groupTitleText === "Alur & Status Tahapan" && (
              <Dropdown
                items={[
                  { label: "Persetujuan", value: "Persetujuan" },
                  {
                    label: "Daya Dukung & Tampung",
                    value: "Daya Dukung & Tampung",
                  },
                  { label: "Amdal", value: "Amdal" },
                  { label: "UKL-UPL", value: "UKL-UPL" },
                  { label: "Permohonan", value: "Permohonan" },
                  {
                    label: "Pengukuhan, Penetapan & Pelepasan",
                    value: "Pengukuhan, Penetapan & Pelepasan",
                  },
                ]}
                label="Jenis Informasi"
                title="Jenis Informasi"
                onSelect={(e) => {
                  if (e.length > 0) {
                    setJenisInformasiDropdown(e[0]);
                  }
                }}
                defaultSelected={[jenisInformasiDropdown]}
              />
            )}

            {/* TODO: Persetujuan */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown === "Persetujuan" && (
                <div>
                  <div className="rounded-lg flex w-full mb-6">
                    {alurData &&
                      alurData.data &&
                      alurData.data.persetujuan.tab.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={cn([
                              index === 0 && "rounded-l-lg",
                              index + 1 ==
                                alurData.data.persetujuan.tab.length &&
                                "rounded-r-lg",
                              "bg-white shadow-small border cursor-pointer",
                              activeTabPersetujuan === item &&
                                "bg-primary text-white cursor-default",
                            ])}
                            onClick={() => {
                              setActiveTabPersetujuan(item);
                            }}
                          >
                            <p className={cn(["py-[9px] px-4 text-body-3"])}>
                              {item}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                  {activeTabPersetujuan === "PPHTR" &&
                    alurData &&
                    alurData.data &&
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
                  {activeTabPersetujuan === "PPHD" &&
                    alurData &&
                    alurData.data &&
                    alurData.data.persetujuan.PPHD && (
                      <ContainerInformation
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
                  {activeTabPersetujuan === "PKK" &&
                    alurData &&
                    alurData.data &&
                    alurData.data.persetujuan.PKK && (
                      <ContainerInformation
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
                  {activeTabPersetujuan === "PPKHN" &&
                    alurData &&
                    alurData.data &&
                    alurData.data.persetujuan.PPKHN && (
                      <ContainerInformation
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
                  {activeTabPersetujuan === "PPKH Eksplorasi" &&
                    alurData &&
                    alurData.data &&
                    alurData.data.persetujuan.PPKHEksporasi && (
                      <ContainerInformation
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
                  {activeTabPersetujuan === "Non Tambang" &&
                    alurData &&
                    alurData.data &&
                    alurData.data.persetujuan.NonTambang && (
                      <ContainerInformation
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
              )}
            {/* TODO: Daya Dukung Dan Tampung */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown === "Daya Dukung & Tampung" && (
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
              )}
            {/* TODO: Amdal */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown === "Amdal" && (
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
              )}
            {/* TODO: UKL-UPL */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown === "UKL-UPL" && (
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
              )}
            {/* TODO: Permohonan */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown === "Permohonan" && (
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
              )}
            {/* TODO: Pengukuhan, Penetapan & Pelepasan */}
            {groupTitleText === "Alur & Status Tahapan" &&
              jenisInformasiDropdown ===
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
