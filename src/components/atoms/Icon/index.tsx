// lib
import { FC } from "react";
// local
import { icons, IconName, cn } from "@/lib";

// type
interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
  const SVG = icons[name];

  if (!SVG) {
    return null;
  }

  return <SVG className={cn(["w-6 h-6 text-black", className])} />;
};
