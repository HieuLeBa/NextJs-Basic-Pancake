"use client";
import { clientSessionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({ children, initialSessionToken }) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken;
    }
  });
  return { children };
}
