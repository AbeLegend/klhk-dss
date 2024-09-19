"use client";
// lib
import { FC } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";

// local
import { COOKIE_TOKEN, decryptText } from "@/lib";
const ArcGISMap = dynamic(
  () => import("../../../components/organisms/MapView"),
  {
    ssr: false,
  }
);

export const DashboardRootScreen: FC = () => {
  return (
    <main className="flex gap-x-10 flex-wrap bg-primary">
      <h1
        className="hidden"
        onClick={() => {
          const token = Cookies.get(COOKIE_TOKEN);
          if (token) {
            console.log("MY TOKEN==>", token);
            console.log("DEC TOKEN==>", decryptText(token));
            console.log(jwtDecode(decryptText(token)));
          }
        }}
      >
        Dashboard
      </h1>

      <div className="w-full h-[10%] max-h-[10%]">
        {/* <div className="relative -top-4 bg-white rounded-t-[32px]"> */}
        <ArcGISMap />
        {/* <h1>tes</h1> */}
        {/* </div> */}
      </div>
    </main>
  );
};
