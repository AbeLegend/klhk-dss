"use client";
// lib
import { FC } from "react";
import { useDispatch } from "react-redux";
// local
import { cn } from "@/lib";
import { useAppSelector } from "@/redux/store";
import { SVGIcon } from "../SVGIcon";
// asset
import OverlayWidgetSVG from "@/icons/overlay-widget.svg";
import { SetIsShowOverlay } from "@/redux/Map/LayerService/slice";

export const OverlayWidget: FC = () => {
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { IsShowOverlay } = useAppSelector((state) => state.layer);

  return (
    <div
      className={cn([
        "absolute left-[1.5%] top-[20%] w-10 h-10 shadow-medium rounded-lg",
        "flex justify-center items-center",
        IsShowOverlay ? "bg-accent-pressed" : "bg-white",
        "cursor-pointer",
      ])}
      onClick={() => {
        dispatch(SetIsShowOverlay(!IsShowOverlay));
      }}
    >
      <SVGIcon
        Component={OverlayWidgetSVG}
        width={24}
        height={24}
        className={cn(["", IsShowOverlay ? "text-[#FFF]" : "text-[#6B7280]"])}
      />
    </div>
  );
};
