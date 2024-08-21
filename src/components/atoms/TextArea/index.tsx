import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  counter?: boolean;
  maxLength?: number;
  error?: boolean;
  errorMessage?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      description,
      counter,
      maxLength,
      error,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    const currentLength = props.value?.toString().length || 0;

    return (
      <div className={cn(["flex flex-col gap-1", className])}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn([
              "text-body-3 font-medium text-gray-900",
              error && "text-error-500",
            ])}
          >
            {label}
          </label>
        )}
        <div
          className={cn([
            "border rounded-md px-3 py-2",
            error
              ? "border-error-500 focus-within:shadow-focus-error"
              : "border-gray-300 focus-within:shadow-focus-success focus-within:border-primary-hover",
            props.disabled && "bg-gray-100 cursor-not-allowed",
          ])}
        >
          <textarea
            ref={ref}
            className={cn([
              "w-full bg-transparent text-body-2 text-gray-900 placeholder-gray-400 focus:outline-none resize-none",
              props.disabled && "cursor-not-allowed text-gray-400",
              className,
            ])}
            maxLength={maxLength}
            {...props}
          />
        </div>
        <div className="flex justify-between text-body-3 text-gray-500">
          {description && (
            <p className={cn([error && "text-error-500"])}>
              {error ? errorMessage : description}
            </p>
          )}
          {counter && maxLength && (
            <p className={cn([error && "text-error-500"])}>
              {`${currentLength}/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
