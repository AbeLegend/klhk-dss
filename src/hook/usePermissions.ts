"use client"
// lib
import { useEffect } from "react";
import Cookies from 'js-cookie'
// local
import { COOKIE_PERMISSIONS, decryptText } from "@/lib";
import { useRouter } from "next/navigation";

interface PermissionProps {
  redirect: string;
  hasPermission: string;
}

export const usePermissions = ({ hasPermission, redirect }: PermissionProps) => {
  // Cookie
  const myPermission = Cookies.get(COOKIE_PERMISSIONS);
  // useRouter
  const router = useRouter()

  useEffect(() => {
    if (myPermission) {
      const decryptPermission = decryptText(myPermission)
      const permission: string[] = JSON.parse(decryptPermission);
      if (!permission.includes(hasPermission)) {
        router.replace(redirect)
      }
    }
  }, [myPermission])
}


