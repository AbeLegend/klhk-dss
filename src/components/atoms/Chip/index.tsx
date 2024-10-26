// lib
import { cn } from "@/lib";
// local
import { FC } from "react";

// type
interface ChipProps {
  value: string;
  className?: string;
  valueClassName?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export const Chip: FC<ChipProps> = ({
  value,
  className,
  valueClassName,
  variant = "primary",
  onClick,
}) => {
  return (
    <div
      className={cn([
        "border",
        variant === "primary" && "bg-[#EBF5F4] border-[#027479]",
        variant === "secondary" && "bg-white border-[#999999]",
        "rounded-lg px-4 py-2 w-fit",
        className,
      ])}
      onClick={onClick}
    >
      <p
        className={cn([
          "text-body-3",
          variant === "primary" && "text-[#027479]",
          variant === "secondary" && "text-[#999999]",
          valueClassName,
        ])}
      >
        {value}
      </p>
    </div>
  );
};
