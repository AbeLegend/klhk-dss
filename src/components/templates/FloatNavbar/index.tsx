"use client";
// lib
import { FC } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import Image from "next/image";

// local
import { Button, Input } from "@/components/atoms";
// asset
import LogoFullImage from "@/images/logo/logo-full-dark.png";
import { HiOutlineSearch } from "react-icons/hi";

export const FloatNavbar: FC = () => {
  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[97.5%] h-[14vh] bg-white rounded-2xl p-4">
      <div className="flex gap-x-4 items-center self-center justify-between">
        {/* Logo */}
        <div className="relative h-[59px] w-[273px]">
          <Image src={LogoFullImage} alt="logo" layout="fill" />
        </div>
        <div className="flex items-center gap-x-4 self-center">
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
          {/* line */}
          <div className="h-[64px] w-[1px] bg-gray-200" />
          {/* search */}
          <Input
            label="Cari"
            placeholder="Masukan Koordinat atau lokasi"
            containerClassName="w-[352px]"
            containerInputClassName="rounded-lg"
            iconLeft={<HiOutlineSearch className="text-gray-700" />}
          />
        </div>
      </div>
    </nav>
  );
};
