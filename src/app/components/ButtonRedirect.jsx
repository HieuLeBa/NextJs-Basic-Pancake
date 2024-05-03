"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ButtonRedirect() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  return (
    <div>
      <button onClick={handleClick}>Chuyển sang trang Login</button>
    </div>
  );
}
