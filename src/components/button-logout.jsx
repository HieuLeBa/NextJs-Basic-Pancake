"use client";
import React from "react";
import { Button } from "./ui/button";
import authApiRequest from "@/apiRequests/auth";
import { usePathname, useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";

export default function ButtonLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
      authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
        router.push(`/login?redirectFrom=${pathname}`);
      });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
