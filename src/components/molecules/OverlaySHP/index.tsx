// lib
import { FC, useEffect, useState } from "react";
// local
import {
  cn,
  getPathFromUrl,
  getUrlIdentifier,
  LegendsType,
  PropertiesType,
  removeUrlEndingNumber,
} from "@/lib";
import { useAppSelector } from "@/redux/store";
import { postAPIWebServiceIntersect } from "@/api/responses";
import {
  DataWebserviceByGeom,
  DataWebserviceByGeom2,
} from "@/redux/Map/MapInteraktif";

type GroupedData = {
  category: string;
  properties: PropertiesType[][];
  legends: LegendsType[];
};

export const OverlaySHP: FC = () => {
  // useAppSelector
  const { layer } = useAppSelector((state) => state.mapInteraktif);
  const { isShpMode, IdLayerService } = useAppSelector((state) => state.layer);
  // useState
  const [data, setData] = useState<
    {
      category: string;
      properties: PropertiesType[][];
      legends: LegendsType[];
    }[]
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const loadIntersect = async (id: number[], callback: () => void) => {
    try {
      if (IdLayerService !== "" && id.length > 0) {
        const { data, status } = await postAPIWebServiceIntersect({
          // IdLayerService,
          IdWebService: id,
        });
        if (status === 200 || status === 201) {
          const groupedData = groupByCategory(data.Data);
          console.log("Grouped Data:", groupedData);
          setData(groupedData);
          callback();
        }
      }
    } catch (err) {
      console.error("Error loading intersect data:", err);
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
  useEffect(() => {
    console.log(data);
  }, [data]);
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
      loadIntersect(ids, loadLegends);
    }
  }, [layer]);
  const processProperties = (properties: PropertiesType[]) => {
    const processedData: { fungsi: string; luas: number }[] = [];

    // Iterasi data berdasarkan pola
    for (let i = 0; i < properties.length / 2; i++) {
      const fungsiIndex = i; // Indeks untuk fungsi
      const luasIndex = i + Math.ceil(properties.length / 2); // Indeks untuk luas

      const fungsi = properties[fungsiIndex]?.Value || "-";
      const luas = parseFloat(properties[luasIndex]?.Value || "0");

      processedData.push({
        fungsi,
        luas: isNaN(luas) ? 0 : luas, // Pastikan luas valid
      });
    }

    return processedData;
  };

  return (
    isShpMode && (
      <div
        className={cn([
          "absolute left-[1.5%] top-[20%] w-[35%] max-h-[75vh] bg-white shadow-medium p-4 rounded-2xl overflow-y-scroll overflow-x-scroll",
          (!data || data.length == 0) && "hidden",
        ])}
      >
        <div className="grid gap-y-3">
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                <div key={index} className="">
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm text-left">
                      <thead>
                        <tr className="bg-green-100">
                          {item.properties[0].map((item, index) => {
                            return (
                              <th
                                className="border border-gray-300 px-4 py-2 font-bold text-center"
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
                              {i.map((item, index) => {
                                return (
                                  <td
                                    key={index}
                                    className="border border-gray-300 px-4 py-2"
                                  >
                                    {item.Value}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                            Total
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {processProperties(item.properties[index])
                              .filter((filter) => filter.luas)
                              .reduce((total, prop) => total + prop.luas, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )
  );
};
