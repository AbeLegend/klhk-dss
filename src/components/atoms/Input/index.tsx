// lib
import { forwardRef, InputHTMLAttributes } from "react";

// local
import { cn } from "@/lib";

// type
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  description?: string;
  error?: boolean;
  errorMessage?: string;
  containerClassName?: string;
  containerInputClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconLeftClassName?: string;
  iconRightClassName?: string;
  errorMessageClassName?: string;
  descriptionClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      iconLeft,
      iconRight,
      description,
      error,
      errorMessage,
      className,
      containerClassName,
      containerInputClassName,
      labelClassName,
      inputClassName,
      iconLeftClassName,
      iconRightClassName,
      errorMessageClassName,
      descriptionClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn(["flex flex-col gap-1", containerClassName])}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn([
              "text-body-3 font-medium text-gray-900",
              // error && "text-error-500",
              labelClassName,
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
            containerInputClassName,
          ])}
        >
          {iconLeft && (
            <div className={cn(["mr-2 text-gray-400", iconLeftClassName])}>
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={cn([
              "flex-1 bg-transparent text-body-2 text-gray-900  focus:outline-none",
              props.disabled && "cursor-not-allowed text-gray-400",
              "placeholder:text-body-3 placeholder:text-gray-400",
              inputClassName,
            ])}
            {...props}
          />
          {iconRight && (
            <div className={cn(["ml-2 text-gray-400", iconRightClassName])}>
              {iconRight}
            </div>
          )}
        </div>
        {description ||
          (errorMessage && (
            <p
              className={cn([
                "text-body-3 text-gray-500",
                error && "text-error-500",
                error && errorMessageClassName,
                !error && descriptionClassName,
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
