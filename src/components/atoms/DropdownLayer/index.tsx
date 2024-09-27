"use client";
// lib
import { FC, ReactNode, useState } from "react";

// local
import { cn } from "@/lib";
import { SVGIcon } from "@/components/atoms";

// assets
import XSVG from "@/icons/x.svg";
import ChevronDownSVG from "@/icons/chevron-down.svg";

interface DropdownLayerProps {
  children: ReactNode;
  // isOpen: boolean;
  // setIsOpen: () => void;
}

export const DropdownLayer: FC<DropdownLayerProps> = ({
  children,
  // isOpen,
  // setIsOpen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <div
        className={cn([
          "px-4 py-2 bg-gray-100 flex justify-between items-center",
          !isOpen ? "rounded-lg" : "rounded-t-lg",
          "cursor-pointer",
        ])}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-body-3 text-gray-900 font-medium">Layer</p>
        <div className="flex items-center">
          {isOpen ? (
            <SVGIcon Component={XSVG} height={24} width={24} />
          ) : (
            <SVGIcon Component={ChevronDownSVG} height={24} width={24} />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="bg-white pt-4 px-4 h-[278px] overflow-y-scroll rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
};
