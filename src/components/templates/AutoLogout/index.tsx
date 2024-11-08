"use client";
// lib
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { decryptText } from "@/lib";
import { useAutoLogout } from "@/hook";

export const AutoLogout = () => {
  useAutoLogout();
  return null; // Nothing needs to render here
};
