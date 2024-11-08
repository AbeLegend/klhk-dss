"use client"
// lib
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// local
import { decryptText } from "@/lib";

export const useAutoLogout = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const tokenExpiredAt = Cookies.get("token_expired_at");

    if (!token || !tokenExpiredAt) {
      return;
    }
    const decryptToken = decryptText(tokenExpiredAt);

    const expiryDate = new Date(decryptToken);
    const currentDate = new Date();

    if (expiryDate <= currentDate) {
      alert("Your session has expired. Please login");
      Cookies.remove("token");
      Cookies.remove("token_expired_at");

      // Redirect to login
      router.replace("/login");
    }
  }, [router]);

  return null;
};