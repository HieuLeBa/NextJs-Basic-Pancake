"use client";
import React, { useEffect } from "react";
import accountApiRequest from "@/apiRequests/account";
import { handleErrorApi } from "@/lib/utils";

export default function Profile() {
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const result = await accountApiRequest.meClient();
        console.log("result", result);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    fetchRequest();
  }, []);
  return <div>Profile</div>;
}
