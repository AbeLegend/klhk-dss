// lib
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Switch from "react-switch";

// local
import {
  cn,
  formatNumber,
  getPathFromUrl,
  getUrlIdentifier,
  LegendsType,
  PropertiesType,
  removeUrlEndingNumber,
} from "@/lib";
import { useAppSelector } from "@/redux/store";
import {
  postAPILayerServiceGetPropertiesByGeom,
  postAPIWebServiceIntersect,
} from "@/api/responses";
import { DataWebserviceByGeom2 } from "@/redux/Map/MapInteraktif";
import {
  SetIdWebServices,
  SetIsLoadingOverlay,
  SetIsShowOverlay,
  SetIsSummary,
  SetTriggerGetPropertiesByGeom,
  SetTriggerIntersect,
} from "@/redux/Map/LayerService/slice";
import { LoadingAnimation } from "@/components/atoms";
import { HiOutlineX } from "react-icons/hi";
import { LayerServiceGeomModel } from "@/api/types";
import { Accordion } from "../Accordion";

type GroupedData = {
  category: string;
  properties: PropertiesType[][];
  legends: LegendsType[];
};

export const OverlaySHP: FC = () => {
  // useAppSelector
  const { layer, location } = useAppSelector((state) => state.mapInteraktif);
  const {
    IdLayerService,
    IsShowOverlay,
    IsSummary,
    IsLoadingOverlay,
    IdWebServices,
    IdLayerServices,
    IsTriggerGetPropertiesByGeom,
    IsTriggerIntersect,
  } = useAppSelector((state) => state.layer);
  // useState
  const [data, setData] = useState<
    {
      category: string;
      properties: PropertiesType[][];
      legends: LegendsType[];
    }[]
  >();
  const [geomData, setGeomData] = useState<LayerServiceGeomModel[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };
  // useDispatch
  const dispatch = useDispatch();

  // function
  const groupByCategory = (data: DataWebserviceByGeom2[]): GroupedData[] => {
    const grouped: Record<string, PropertiesType[][]> = {};

    data.forEach((item) => {
      const category = item.WebService.Category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category] = [...grouped[category], ...item.Properties];
    });

    return Object.entries(grouped).map(([category, properties]) => ({
      category,
      properties,
      legends: [], // Will be populated later in `loadLegends`
    }));
  };

  const handleSwitch = (e: boolean) => {
    dispatch(SetIsSummary(e));
    if (IsShowOverlay) {
      if (IsSummary) {
        dispatch(SetTriggerIntersect(true));
      } else {
        dispatch(SetTriggerGetPropertiesByGeom(true));
      }
    }
  };
  const loadIntersect = async () =>
    // callback: () => void
    {
      try {
        // dispatch(SetLoadingGeneral(true));
        dispatch(SetIsLoadingOverlay(true));

        let formData: { IdLayerService?: string; IdWebService?: number[] } = {};
        if (IdLayerService) {
          formData.IdLayerService = IdLayerService;
        }
        if (IdWebServices.length > 0) {
          formData.IdWebService = IdWebServices;
        }
        const { data, status } = await postAPIWebServiceIntersect(formData);
        if (status === 200 || status === 201) {
          const groupedData = groupByCategory(data.Data);
          // console.log("Grouped Data:", groupedData);
          setData(groupedData);
          // callback(); // buat loadlegends
        }
      } catch (err) {
        console.error("Error loading intersect data:", err);
      } finally {
        // dispatch(SetLoadingGeneral(false));
        dispatch(SetTriggerIntersect(false));
        dispatch(SetIsLoadingOverlay(false));
      }
    };

  const loadPropertiesByGeom = async () =>
    // callback: () => void

    {
      try {
        dispatch(SetIsLoadingOverlay(true));

        let formData: {
          Latitude: string;
          Longitude: string;
          IdLayerService?: string[];
          IdWebService?: number[];
        } = {
          Latitude: `${location.latitude}`,
          Longitude: `${location.longitude}`,
          IdLayerService: [],
          IdWebService: [],
        };
        if (IdLayerServices.length > 0) {
          formData.IdLayerService = IdLayerServices;
        }
        if (IdWebServices.length > 0) {
          formData.IdWebService = IdWebServices;
        }
        const { data, status } = await postAPILayerServiceGetPropertiesByGeom(
          formData
        );
        if (status === 200 || status === 201) {
          setGeomData(data.Data);
          console.log("DATA GEOM OVERLAY", data);
          // const groupedData = groupByCategory(data.Data);
          // console.log("Grouped Data:", groupedData);
          // setData(groupedData);
          // callback(); // buat loadlegends
        }
      } catch (err) {
        console.error("Error loading intersect data:", err);
      } finally {
        dispatch(SetTriggerGetPropertiesByGeom(false));
        dispatch(SetIsLoadingOverlay(false));
      }
    };

  const loadLegends = async () => {
    try {
      const activeLayers = layer.filter((item) => item.isActive);

      if (activeLayers.length > 0) {
        for (const item of activeLayers) {
          if (item.data && item.data.length > 0) {
            for (const value of item.data) {
              const legends = await fetchLegend(value.WebService.Url);
              setData((prevData) =>
                prevData
                  ? prevData.map((group) =>
                      group.category === value.WebService.Category
                        ? {
                            ...group,
                            legends: [...group.legends, ...legends],
                          }
                        : group
                    )
                  : []
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("Error loading legends:", err);
    }
  };

  const fetchLegend = async (url: string): Promise<LegendsType[]> => {
    const prefix = getUrlIdentifier(url);
    const urlFixed = getPathFromUrl(url);
    const legendUrl = `/${prefix}${removeUrlEndingNumber(
      urlFixed
    )}/legend?f=json`;

    try {
      const response = await fetch(legendUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Extracting legends from the API response
      const legends = data.layers?.flatMap((layer: any) =>
        layer.legend.map((legend: any) => ({
          label: legend.label,
          imageData: legend.imageData,
          values: legend.values,
        }))
      );

      return legends || [];
    } catch (error) {
      console.error("Error fetching legend:", error);
      return [];
    }
  };

  // useEffect
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);
  useEffect(() => {
    if (layer) {
      let ids: number[] = [];
      layer
        .filter((filter) => filter.isActive)
        .map((i) => {
          return (
            i.data &&
            i.data.map((item) => {
              ids.push(item.WebService.Id);
            })
          );
        });
      dispatch(SetIdWebServices(ids));
    }
  }, [layer]);

  // INTERSECT
  useEffect(() => {
    if (IsSummary && !IsLoadingOverlay && IsShowOverlay && IsTriggerIntersect) {
      loadIntersect();
    }
  }, [IsSummary, IsLoadingOverlay, IsShowOverlay, IsTriggerIntersect]);
  // GEOM
  useEffect(() => {
    if (
      !IsSummary &&
      !IsLoadingOverlay &&
      IsShowOverlay &&
      IsTriggerGetPropertiesByGeom
    ) {
      loadPropertiesByGeom();
    }
  }, [
    IsSummary,
    IsLoadingOverlay,
    IsShowOverlay,
    IsTriggerGetPropertiesByGeom,
  ]);

  useEffect(() => {
    console.log({ IsSummary });
  }, [IsSummary]);

  const processProperties = (properties: PropertiesType[][]) => {
    let processedData: number = 0;

    // Iterasi data berdasarkan pola
    for (let i = 0; i < properties.length; i++) {
      for (let j = 0; j < properties[i].length; j++) {
        // Jika Value adalah angka, maka tambahkan ke processedData
        if (
          !isNaN(Number(properties[i][j].Value)) &&
          properties[i][j].Key.toLowerCase().includes("luas")
        ) {
          processedData += Number(properties[i][j].Value);
        }
      }
    }

    return processedData;
  };

  return (
    <div
      className={cn([
        "absolute left-[5%] top-[20%] w-[35%] max-h-[75vh] bg-white shadow-medium p-4 rounded-2xl",
      ])}
    >
      <div className="flex gap-x-2 items-center mb-4">
        <p>Tampilkan hanya summary</p>
        <Switch
          className={cn([IsLoadingOverlay, "cursor-wait"])}
          disabled={IsLoadingOverlay}
          uncheckedIcon={false}
          checkedIcon={false}
          onColor="#C5900C"
          checked={IsSummary}
          onChange={handleSwitch}
        />
      </div>
      <div className="">
        <div className="h-fit max-h-[60vh] overflow-y-scroll overflow-x-scroll">
          {IsSummary ? (
            IsLoadingOverlay ? (
              <div className="flex justify-center text-center">
                <LoadingAnimation />
              </div>
            ) : (
              // Summary Data Here
              <div className="grid gap-y-3">
                {data && data.length > 0 ? (
                  data.map((item, index) => {
                    return (
                      <div key={index} className="">
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-300 text-sm text-left">
                            <thead>
                              <tr className="bg-primary">
                                {item.properties[0].map((item, index) => {
                                  return (
                                    <th
                                      className="border border-gray-300 px-4 py-2 text-white font-bold text-center"
                                      key={index}
                                    >
                                      {item.Key}
                                    </th>
                                  );
                                })}
                              </tr>
                            </thead>
                            <tbody>
                              {item.properties.map((i, ix) => {
                                return (
                                  <tr key={ix}>
                                    {i.map((items, index) => {
                                      return (
                                        <td
                                          key={index}
                                          className={cn([
                                            "border border-gray-300 px-4 py-2",
                                            !isNaN(Number(items.Value)) &&
                                              "text-right",
                                          ])}
                                        >
                                          {!isNaN(Number(items.Value))
                                            ? formatNumber(items.Value)
                                            : items.Value}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                );
                              })}
                              {/* Baris total */}
                              <tr>
                                <td
                                  colSpan={item.properties[0].length - 1}
                                  className="border border-gray-300 px-4 py-2 text-center font-bold"
                                >
                                  Total
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                  {formatNumber(
                                    processProperties(item.properties)
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <p className="text-body-3 text-center">Tidak ada data</p>
                  </div>
                )}
              </div>
            )
          ) : IsLoadingOverlay ? (
            <div className="flex justify-center text-center">
              <LoadingAnimation />
            </div>
          ) : (
            // All Data Here
            <div className="grid gap-y-4">
              {geomData &&
                geomData.length > 0 &&
                geomData.map((item, index) => {
                  return (
                    <Accordion
                      key={index}
                      title={item.Title}
                      isOpen={openAccordion === `${index}`}
                      onToggle={() => handleToggle(`${index}`)}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-sm text-left">
                          <thead>
                            <tr className="bg-primary">
                              {item.Attributes[0].map((item2, index2) => {
                                return (
                                  <th
                                    className="border border-gray-300 px-4 py-2 text-white font-bold text-center"
                                    key={index2}
                                  >
                                    {item2.Key}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {item.Attributes.map((item2, index2) => {
                              return (
                                <tr key={index2}>
                                  {item2.map((item3, index3) => {
                                    return (
                                      <td
                                        key={index3}
                                        className={cn([
                                          "border border-gray-300 px-4 py-2",
                                          !isNaN(Number(item3.Value)) &&
                                            "text-right",
                                        ])}
                                      >
                                        {!isNaN(Number(item3.Value))
                                          ? formatNumber(item3.Value)
                                          : item3.Value}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                            {/* Baris total */}
                            {/* <tr>
                        <td
                          colSpan={item.Attributes[0].length - 1}
                          className="border border-gray-300 px-4 py-2 text-center font-bold"
                        >
                          Total
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatNumber(processProperties(item.Attributes))}
                        </td>
                      </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </Accordion>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
