// lib
import { ButtonHTMLAttributes, FC, ReactNode } from "react";

// local
import { cn } from "@/lib";

// interface
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  labelClassName?: string;
  variant?: "primary" | "secondary";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  label,
  labelClassName,
  variant = "primary",
  iconLeft,
  iconRight,
  className,
  ...rest
}) => {
  return (
    <button className={cn([className])} {...rest}>
      {iconLeft && <span>{iconLeft}</span>}
      <span className={cn(["text-body-3", labelClassName, "font-medium"])}>
        {label}
      </span>
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
};
