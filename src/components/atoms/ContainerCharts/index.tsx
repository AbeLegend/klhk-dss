// lib
import { FC, ReactNode } from "react";
// local
import { cn } from "@/lib";

// type
interface ContainerChartsProps {
  children: ReactNode;
  className?: string;
}
export const ContainerCharts: FC<ContainerChartsProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn([
        "bg-gray-50 border border-gray-200 rounded-[30px] p-6",
        className,
      ])}
    >
      {children}
    </div>
  );
};
