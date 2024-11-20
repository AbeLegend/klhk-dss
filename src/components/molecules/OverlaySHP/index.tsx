// lib
import { FC, useEffect, useState } from "react";
// local
import { cn } from "@/lib";
import { useAppSelector } from "@/redux/store";
import { postAPIWebServiceIntersect } from "@/api/responses";
import { DataWebserviceByGeom } from "@/redux/Map/MapInteraktif";

// type
type Property = {
  Key: string;
  Value: string;
  Index: number;
};

type GroupedData = {
  category: string;
  properties: Property[];
};

export const OverlaySHP: FC = () => {
  // useAppSelector
  const { layer } = useAppSelector((state) => state.mapInteraktif);
  const { isShpMode, IdLayerService } = useAppSelector((state) => state.layer);
  // useState
  const [data, setData] = useState<
    {
      category: string;
      properties: {
        Key: string;
        Value: string;
        Index: number;
      }[];
    }[]
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // function
  const groupByCategory = (data: DataWebserviceByGeom[]): GroupedData[] => {
    const grouped: Record<string, Property[]> = {};

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
    }));
  };

  // loadData
  const loadIntersect = async (id: number[]) => {
    try {
      if (IdLayerService !== "" && id.length > 0) {
        const { data, status } = await postAPIWebServiceIntersect({
          IdLayerService,
          IdWebService: id,
        });
        if (status === 200 || status === 201) {
          console.log(groupByCategory(data.Data));
          setData(groupByCategory(data.Data));
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      //
    }
  };

  // useEffect
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
      loadIntersect(ids);
    }
  }, [layer]);

  return (
    isShpMode && (
      <div
        className={cn([
          "absolute left-[1.5%] top-[20%] w-[25%] max-h-[75vh] bg-white shadow-medium p-4 rounded-2xl overflow-y-scroll overflow-x-scroll",
          (!data || data.length == 0) && "hidden",
        ])}
      >
        {/* {layer
          .filter((filter) => filter.isActive === true)
          .map((item, index) => {
            return (
              <div key={index} className="border">
                {item.UriTitle}
                {item.data &&
                  item.data.length > 0 &&
                  item.data.map((data, indexData) => {
                    return <div key={indexData}>{data.WebService.Id}</div>;
                  })}
              </div>
            );
          })} */}
        <div className="grid gap-y-3">
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                <div key={index} className="border rounded-md p-1">
                  <h6 className="font-semibold">{item.category}</h6>
                  <div>
                    {item.properties.map((prop, indexProp) => {
                      return (
                        <div key={indexProp} className="flex">
                          <p className="text-body-3 text-black font-medium">{`${prop.Key}:`}</p>
                          <p className="text-body-3 text-gray-700">
                            {prop.Value === "" ? " -" : ` ${prop.Value}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )
  );
};
