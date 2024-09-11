"use client";

import Link from "next/link";
import { decryptKey } from "../lib/utils";
import { usePathname } from "next/navigation";

const NavigateToAdminPage = () => {
  const path = usePathname();
  const customPath = () => {
    try {
      // if( typeof window === "undefined")  return "/?admin=true";
      const savedKey: string | null =
        (path && window && window.localStorage.getItem("accessKey")) || null;
      if (!savedKey) return "/?admin=true";
      const decryptedKey = decryptKey(savedKey);
      if (decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY)
        return "/admin";
    } catch (err) {
      console.error("Error occured in <NavigateToAdminPage/>", err);
      throw new Error("Error occured in <NavigateToAdminPage/> =>" + err);
      
    }
    return "/?admin=true";
  };
  return (
    <Link href={customPath()} className="text-green-500">
      Admin
    </Link>
  );
};

export default NavigateToAdminPage;
