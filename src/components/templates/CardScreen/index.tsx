// lib
import { FC, ReactNode } from "react";

// local
import { cn } from "@/lib";
import { Button, SVGIcon } from "@/components/atoms";

// asset
import { HiArrowNarrowLeft } from "react-icons/hi";

// type
interface CardScreenProps {
  children: ReactNode;
  textLeft: string | ReactNode;
  textRight: string | ReactNode;
  containerClassName?: string;
  childrenClassName?: string;
  backButton?: boolean;
  description?: string;
}

export const CardScreen: FC<CardScreenProps> = ({
  children,
  textLeft,
  textRight,
  containerClassName,
  childrenClassName,
  backButton,
  description = null,
}) => {
  return (
    <div
      className={cn([
        "bg-white rounded-t-2xl py-12 px-10 h-screen",
        containerClassName,
      ])}
    >
      {backButton && (
        <Button
          iconLeft={<HiArrowNarrowLeft />}
          label="Kembali"
          variant="outline-destructive"
          className="mb-6"
        />
      )}

      <div
        className={cn(["flex justify-between", description === null && "mb-6"])}
      >
        <div>
          {typeof textLeft === "string" ? (
            <h3 className="text-heading-3 text-gray-800 font-semibold">
              {textLeft}
            </h3>
          ) : (
            textLeft
          )}
        </div>
        {typeof textRight === "string" ? (
          <h4 className="text-heading-4 text-gray-700 font-medium">
            {textRight}
          </h4>
        ) : (
          textRight
        )}
      </div>
      {/* desc */}
      {description && (
        <div className="my-6">
          <h5 className="text-heading-5 text-gray-600 font-semibold">
            {description}
          </h5>
        </div>
      )}
      <div className={cn([childrenClassName])}>{children}</div>
    </div>
  );
};
