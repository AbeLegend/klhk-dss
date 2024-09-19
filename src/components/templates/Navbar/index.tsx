"use client";
// lib
import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// local
import { SVGIcon } from "@/components/atoms";
// assets
import LogoFullImage from "@/images/logo/logo-full.png";
import EmailSVG from "@/icons/email.svg";
import BellSVG from "@/icons/bell.svg";
import OverviewSVG from "@/icons/overview.svg";
import PerencanaanSVG from "@/icons/perencanaan.svg";
import TrackingSVG from "@/icons/tracking.svg";
import MonitoringSVG from "@/icons/monitoring.svg";
import { COOKIE_TOKEN } from "@/lib";

export const Navbar: FC = () => {
  const router = useRouter();
  return (
    <nav className="bg-primary w-full px-10">
      {/* <div className="pt-4 pb-12 mx-auto grid grid-cols-12"> */}
      <div className="pt-4 pb-4 mx-auto grid grid-cols-12">
        <div className="col-span-3">
          <div className="relative h-[59px] w-[302px]">
            <Image src={LogoFullImage} alt="logo" layout="fill" />
          </div>
        </div>
        <div className="col-span-6 flex gap-x-2 items-center justify-center">
          <div className="bg-accent rounded-[20px] py-[10px] px-3 flex gap-x-2 items-center h-fit">
            <SVGIcon Component={OverviewSVG} width={24} height={24} />
            <p className="text-body-3 text-white font-semibold">Overview</p>
          </div>
          <div className="rounded-[20px] py-[10px] px-3 flex gap-x-2 items-center h-fit">
            <SVGIcon Component={PerencanaanSVG} width={24} height={24} />
            <p className="text-body-3 text-gray-300 font-semibold">
              Perencanaan
            </p>
          </div>
          <div className="rounded-[20px] py-[10px] px-3 flex gap-x-2 items-center h-fit">
            <SVGIcon Component={TrackingSVG} width={24} height={24} />
            <p className="text-body-3 text-gray-300 font-semibold">Tracking</p>
          </div>
          <div className="rounded-[20px] py-[10px] px-3 flex gap-x-2 items-center h-fit">
            <SVGIcon Component={MonitoringSVG} width={24} height={24} />
            <p className="text-body-3 text-gray-300 font-semibold">
              Monitoring
            </p>
          </div>
        </div>
        <div className="col-span-3 flex gap-x-4 items-center justify-end">
          {/* BEGIN: Notification */}
          <div className="flex items-center gap-x-4 mr-2">
            <div className="p-3 rounded-full bg-white">
              <SVGIcon Component={EmailSVG} width={20} height={20} />
            </div>
            <div className="p-3 rounded-full bg-white">
              <SVGIcon Component={BellSVG} width={20} height={20} />
            </div>
          </div>
          {/* END: Notification */}
          {/* BEGIN: Profile */}
          <div
            className="py-2 px-4 bg-white rounded-[20px] flex gap-x-3 w-fit cursor-pointer"
            onClick={() => {
              Cookies.remove(COOKIE_TOKEN);
              router.push("/login");
            }}
          >
            <div className="rounded-full bg-[#F0F1F5] w-11 h-11" />
            <div className="grid gap-y-1">
              <p className="text-body-3 font-semibold">Junnaedi</p>
              <p className="text-body-3 font-medium">Account Owner 1</p>
            </div>
          </div>
          {/* END: Profile */}
        </div>
      </div>
    </nav>
  );
};
