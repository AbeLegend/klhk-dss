// lib
import { FC, ReactNode } from "react";

// local
import { cn } from "@/lib";

// interface
interface ContainerInformationProps {
  title: string;
  titleClassName?: string;
  children: ReactNode;
  childrenClassName?: string;
  containerClassName?: string;
}

export const ContainerInformation: FC<ContainerInformationProps> = ({
  title,
  titleClassName,
  children,
  childrenClassName,
  containerClassName,
}) => {
  return (
    <div className={cn([containerClassName])}>
      <p
        className={cn([
          "text-body-3 text-gray-900 font-medium mb-6",
          titleClassName,
        ])}
      >
        {title}
      </p>
      <div className={cn([childrenClassName])}>{children}</div>
    </div>
  );
};
