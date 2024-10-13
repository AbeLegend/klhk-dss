// lib
import { FC, ReactNode } from "react";
// local
import { cn } from "@/lib";

// type
interface ContainerChartProps {
  children: ReactNode;
  className?: string;
}
export const ContainerChart: FC<ContainerChartProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn([
        "bg-white border border-gray-200 rounded-[15px] py-4 px-6",
        className,
      ])}
    >
      {children}
    </div>
  );
};
