"use client";
import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/store";

interface Props {
  groupTitleText: string;
  groupCategoryText: string;
}

export const DataDisplayComponent: React.FC<Props> = ({
  groupTitleText,
  groupCategoryText,
}) => {
  const { layer } = useAppSelector((state) => state.mapInteraktif);
  const activeData = layer.filter((item) => item.isActive && item.data);

  useEffect(() => {
    console.log(activeData);
  }, [activeData]);
  return (
    <div>
      {activeData.map((layer, index) =>
        layer.data?.map((dataItem) => {
          const { WebService, Properties } = dataItem;
          const shouldDisplayGroup = WebService.Group.Title === groupTitleText;
          const shouldDisplayCategory =
            WebService.GroupCategory === groupCategoryText;

          // Display only items matching groupTitleText and groupCategoryText
          if (
            !shouldDisplayGroup ||
            (!shouldDisplayCategory && WebService.GroupCategory !== null)
          )
            return null;

          return (
            <div key={`${layer.UriTitle}-${index}`} className="group-section">
              <h2>{WebService.Title}</h2>

              {Properties.length > 0 && (
                <div className="properties">
                  {Properties.map((property) => (
                    <div key={property.Key} className="property-card">
                      <span>{property.Key}</span>
                      <span>{property.Value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabbed section based on GroupCategory */}
              <div className="tabs">
                {WebService.GroupCategory === null ? (
                  <div className="tab-content">
                    <h3>{WebService.Title}</h3>
                  </div>
                ) : (
                  <>
                    <button
                      className="tab-button"
                      onClick={() => /* Handle Tab Change */ {}}
                    >
                      Informasi
                    </button>
                    <button
                      className="tab-button"
                      onClick={() => /* Handle Tab Change */ {}}
                    >
                      History dan Perubahan
                    </button>
                    {/* Render content based on selected tab */}
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
