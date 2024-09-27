// lib
import { FC, ReactNode } from "react";

// local
import { cn } from "@/lib";

// type
type DataType = {
  title: string;
  description: string | ReactNode;
  dataClassName?: string;
};

// interface
interface ContainerDataProps {
  data: DataType[];
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  descriptionNodeClassName?: string;
}

export const ContainerData: FC<ContainerDataProps> = ({
  data,
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
  descriptionNodeClassName,
}) => {
  return (
    <div
      className={cn([
        "bg-white p-4 rounded-lg gap-y-2",
        "grid grid-cols-12 justify-between",
        containerClassName,
      ])}
    >
      {data.map((item, index) => {
        const { title, description, dataClassName } = item;
        return (
          <div
            key={index}
            className={cn(["text-body-3", className, dataClassName])}
          >
            <p className={cn(["text-gray-800 font-semibold", titleClassName])}>
              {title}
            </p>
            {typeof description === "string" ? (
              <p className={cn(["text-gray-800", descriptionClassName])}>
                {description}
              </p>
            ) : (
              <div className={cn([descriptionNodeClassName])}>
                {description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
