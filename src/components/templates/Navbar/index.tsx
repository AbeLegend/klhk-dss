"use client";
// lib
import Image from "next/image";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { RiArrowDropDownLine } from "react-icons/ri";

// local
import { Button, Icon } from "@/components/atoms";
// assets
import LogoFullImage from "@/images/logo/logo-full.png";
import { cn, COOKIE_TOKEN } from "@/lib";

export const Navbar: FC = () => {
  // useRouter
  const router = useRouter();
  // usePathname
  const pathname = usePathname();

  return (
    <nav className="bg-primary w-full px-10">
      {/* <div className="pt-4 pb-12 mx-auto grid grid-cols-12"> */}
      <div className="pt-4 pb-4 grid grid-cols-12">
        <div className="col-span-3">
          <div className="relative h-[59px] w-[302px]">
            <Image src={LogoFullImage} alt="logo" layout="fill" />
          </div>
        </div>
        <div className="col-span-5 flex items-center justify-center">
          <Menu
            title="Overview"
            icon={<Icon name="OverviewIcon" className="text-white" />}
            isActive={false}
          />
          <Menu
            title="Perencanaan"
            icon={<Icon name="PerencanaanIcon" className="text-white" />}
            isActive={false}
          />
          <Menu
            title="Statistik"
            icon={<Icon name="TrackingIcon" className="text-white" />}
            isActive={false}
          />
          <Menu
            title="Monitoring"
            icon={<Icon name="MonitoringIcon" className="text-accent" />}
            isActive={true}
            isDropdown={true}
            dropdownItem={[
              {
                name: "Monitoring Evaluasi",
                url: "/monitoring-evaluasi",
              },
              {
                name: "Kepegawaian",
                url: "/kepegawaian",
              },
            ]}
          />
        </div>
        <div className="col-span-4 gap-x-4 items-center justify-between grid grid-cols-2">
          {/* BEGIN: Map Interactive */}
          <div className="justify-self-end">
            <Button
              label="Map Interaktif"
              variant="outline"
              className={cn(["items-center cursor-pointer"])}
              iconLeft={<Icon name="TrackingIcon" className="text-gray-700" />}
              onClick={() => {
                if (pathname !== "/map-interaktif") {
                  router.push("/map-interaktif");
                }
              }}
            />
          </div>
          {/* END: Map Interactive */}
          {/* BEGIN: Profile */}
          <div className="justify-self-end min-w-[90%]">
            <div
              className="flex gap-x-3 cursor-pointer"
              onClick={() => {
                Cookies.remove(COOKIE_TOKEN);
                router.push("/login");
              }}
            >
              <div className="rounded-full bg-[#F0F1F5] min-w-11 min-h-11 w-11 h-11" />
              <div className="grid gap-y-1">
                <p className="text-body-3 font-semibold text-white line-clamp-1">
                  Junnaedi
                </p>
                <p className="text-body-3 font-medium text-white">
                  Account Owner 1
                </p>
              </div>
            </div>
          </div>
          {/* END: Profile */}
        </div>
      </div>
    </nav>
  );
};

const Menu: FC<{
  title: string;
  isDropdown?: boolean;
  isActive?: boolean;
  icon: ReactNode;
  dropdownItem?: { name: string; url: string }[];
}> = ({ title, isDropdown = false, isActive = false, icon, dropdownItem }) => {
  // useState
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // useRef
  const divRef = useRef<HTMLDivElement>(null);

  // useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div
      className={cn([
        "flex gap-x-2 items-center mx-1 px-3 py-[10px]",
        isActive && "border-b-2 border-b-accent",
        !isActive && "cursor-pointer",
        isDropdown && "cursor-pointer",
        "relative",
      ])}
      onClick={(e) => {
        e.stopPropagation();
        if (isDropdown) {
          setIsOpen(!isOpen);
        }
      }}
      ref={divRef}
    >
      <div className="w-6 h-6 text-accent">{icon}</div>
      <p
        className={cn([
          "text-body-3",
          isActive ? "text-accent" : "text-white",
          "font-semibold",
        ])}
      >
        {title}
      </p>
      {isDropdown && <RiArrowDropDownLine className="w-6 h-6 text-accent" />}
      {isDropdown && isOpen && (
        <div
          className={cn([
            "absolute -bottom-28 left-0 bg-white shadow-medium rounded-xl w-fit z-50",
          ])}
        >
          {dropdownItem &&
            dropdownItem.length > 0 &&
            dropdownItem.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn([
                    "p-4 border-b border-b-gray-200",
                    index === 0 && "rounded-t-xl",
                    dropdownItem.length === index + 1 &&
                      "border-b-0 rounded-b-xl",
                    "hover:bg-gray-200",
                  ])}
                >
                  <p className="text-body-3 text-gray-700 ">{item.name}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
