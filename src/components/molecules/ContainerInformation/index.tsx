// lib
import { FC, ReactNode } from "react";

// local
import { cn } from "@/lib";

// interface
interface ContainerInformationProps {
  title: string;
  secondTitle?: string;
  titleClassName?: string;
  titleContainerClassName?: string;
  secondTitleClassName?: string;
  children: ReactNode;
  childrenClassName?: string;
  containerClassName?: string;
}

export const ContainerInformation: FC<ContainerInformationProps> = ({
  title,
  secondTitle,
  titleClassName,
  titleContainerClassName,
  secondTitleClassName,
  children,
  childrenClassName,
  containerClassName,
}) => {
  return (
    <div className={cn([containerClassName])}>
      <div
        className={cn([
          secondTitle && "flex justify-between items-center",
          titleContainerClassName,
        ])}
      >
        <p
          className={cn([
            "text-body-3 text-gray-900 font-medium mb-6",
            titleClassName,
          ])}
        >
          {title}
        </p>
        {secondTitle && (
          <p
            className={cn([
              "text-body-3 text-gray-900 font-medium mb-6",
              secondTitleClassName,
            ])}
          >
            {secondTitle}
          </p>
        )}
      </div>
      <div className={cn([childrenClassName])}>{children}</div>
    </div>
  );
};
