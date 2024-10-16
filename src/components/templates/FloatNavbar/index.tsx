"use client";
// lib
import { FC } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Image from "next/image";
import { HiOutlineSearch } from "react-icons/hi";

// local
import { Button, Icon, Input } from "@/components/atoms";
// asset
import LogoFullImage from "@/images/logo/logo-full-dark.png";
import { useRouter } from "next/navigation";

export const FloatNavbar: FC = () => {
  // useRouter
  const router = useRouter();
  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[97.5%] h-[14vh] bg-white rounded-2xl p-4">
      <div className="flex gap-x-4 items-center self-center justify-between">
        {/* Logo */}
        <div className="relative h-[59px] w-[273px]">
          <Image src={LogoFullImage} alt="logo" layout="fill" />
        </div>
        <div className="flex items-center gap-x-4">
          {/* upload file */}
          <div className="px-2 py-1 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex gap-x-14 h-[64px] items-center">
            <div>
              <p className="text-body-3 text-gray-900 font-medium mb-1">
                Upload SHP
              </p>
              <p className="text-xs text-gray-600">
                Cari wilayah berdasarkan file SHP
              </p>
            </div>
            <Button
              label="Pilih File"
              variant="primary-destructive"
              size="sm"
            />
          </div>
          {/* BEGIN: Search */}
          <Input
            placeholder="Masukan Koordinat atau lokasi"
            containerClassName="w-[352px]"
            containerInputClassName="rounded-lg"
            iconLeft={<HiOutlineSearch className="text-gray-700" />}
          />
          {/* END: Search */}
          {/* BEGIN: line */}
          <div className="h-[64px] w-[1px] bg-gray-200" />
          {/* END: line */}
          {/* BEGIN: Button */}
          <Button
            label="Dashboard"
            variant="outline"
            iconLeft={
              <Icon
                name="DashboardMonitorIcon"
                className="text-gray-700 w-[18px] h-[18px]"
              />
            }
            onClick={() => {
              router.push("/dashboard");
            }}
          />
          {/* END: Button */}
        </div>
        {/* BEGIN: Profile */}
        <div className="justify-self-end  ">
          <div
            className="flex gap-x-3 cursor-pointer"
            onClick={() => {
              //
            }}
          >
            <div className="rounded-full bg-[#F0F1F5] min-w-11 min-h-11 w-11 h-11" />
            <div className="grid gap-y-1">
              <p className="text-body-3 font-semibold text-black line-clamp-1">
                Junnaedi
              </p>
              <p className="text-body-3 font-medium text-black">
                Account Owner 1
              </p>
            </div>
          </div>
        </div>
        {/* END: Profile */}
      </div>
    </nav>
  );
};
