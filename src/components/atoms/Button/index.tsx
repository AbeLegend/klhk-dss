// lib
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

// local
import { cn } from "@/lib";

// interface
interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  labelClassName?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "primary-destructive"
    | "secondary-destructive"
    | "outline-destructive";
  size?: "sm" | "md" | "lg" | "xl";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isIconOnly?: boolean;
}

type ButtonProps = ButtonBaseProps &
  (ButtonBaseProps["isIconOnly"] extends true
    ? { label?: string; iconOnly: ReactNode }
    : { label: string });

export const Button: FC<ButtonProps> = ({
  label,
  labelClassName,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  isIconOnly,
  className,
  ...rest
}) => {
  return (
    <button
      className={cn([
        variant === "primary" && "bg-primary text-white",
        variant === "secondary" && "bg-primary-surface text-primary",
        variant === "primary-destructive" && "bg-accent text-white",
        variant === "secondary-destructive" && "bg-accent-surface text-accent",
        variant === "outline" &&
          "bg-white text-gray-700 border border-gray-300",
        variant === "outline-destructive" &&
          "bg-white text-accent border border-accent",
        "flex items-center",
        size === "sm" && "px-[10px] py-[6px] gap-x-[6px]",
        size === "md" && "px-[16px] py-[8px] gap-x-[6px]",
        size === "lg" && "px-[20px] py-[8px] gap-x-[6px]",
        size === "xl" && "px-[24px] py-[10px] gap-x-[7px]",
        "rounded-lg",
        className,
      ])}
      {...rest}
    >
      {!isIconOnly && iconLeft && iconLeft}
      {!isIconOnly && (
        <span className={cn(["text-body-3", labelClassName, "font-medium"])}>
          {label}
        </span>
      )}
      {!isIconOnly && iconRight && iconRight}
    </button>
  );
};
