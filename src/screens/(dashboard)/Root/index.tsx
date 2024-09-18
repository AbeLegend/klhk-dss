"use client";
// lib
import { FC } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
// local
import { COOKIE_TOKEN, decryptText } from "@/lib";
import { useRouter } from "next/navigation";

export const DashboardRootScreen: FC = () => {
  const router = useRouter();
  return (
    <main className="flex gap-x-10 flex-wrap">
      <h1
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
      <button
        onClick={() => {
          Cookies.remove(COOKIE_TOKEN);
          router.push("/login");
        }}
      >
        Logout
      </button>
    </main>
  );
};
