import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  description?: string;
  error?: boolean;
  errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      description,
      error,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(["flex flex-col gap-1", className])}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn([
              "text-body-3 font-medium text-gray-900",
              // error && "text-error-500",
            ])}
          >
            {label}
          </label>
        )}
        <div
          className={cn([
            "flex items-center border rounded-md px-3 py-2",
            error
              ? "border-error-500 focus-within:shadow-focus-error"
              : "border-gray-300 focus-within:shadow-focus-success focus-within:border-primary-hover",
            props.disabled && "bg-gray-100 cursor-not-allowed",
          ])}
        >
          {leftIcon && <div className="mr-2 text-gray-400">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn([
              "flex-1 bg-transparent text-body-2 text-gray-900 placeholder-gray-400 focus:outline-none",
              props.disabled && "cursor-not-allowed text-gray-400",
            ])}
            {...props}
          />
          {rightIcon && <div className="ml-2 text-gray-400">{rightIcon}</div>}
        </div>
        {description ||
          (errorMessage && (
            <p
              className={cn([
                "text-body-3 text-gray-500",
                error && "text-error-500",
              ])}
            >
              {error ? errorMessage : description}
            </p>
          ))}
      </div>
    );
  }
);

Input.displayName = "Input";
