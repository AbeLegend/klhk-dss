// lib
import { cn } from "@/lib";
import { FC, ReactNode } from "react";
import { HiOutlinePlus, HiMinus } from "react-icons/hi";

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  containerClassName?: string;
  childrenClassName?: string;
}

export const Accordion: FC<AccordionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  containerClassName,
  childrenClassName,
}) => {
  return (
    <div
      className={cn([
        "bg-gray-50 border border-gray-200 rounded-xl py-3 px-4",
        containerClassName,
      ])}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <p
          className={cn([
            "text-body-2 text-gray-800 font-medium",
            isOpen && "mb-4",
          ])}
        >
          {title}
        </p>
        <div>{isOpen ? <HiMinus /> : <HiOutlinePlus />}</div>
      </div>
      {isOpen && <div className={cn([childrenClassName])}>{children}</div>}
    </div>
  );
};
