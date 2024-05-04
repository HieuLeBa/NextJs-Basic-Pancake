import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";

export default function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link href={"/products"}>Sản phẩm</Link>
        </li>
        <li>
          <Link href={"/login"}>Đăng nhập</Link>
        </li>
        <li>
          <Link href={"/register"}>Đăng ký</Link>
        </li>
        <li>
          <ButtonLogout />
        </li>
      </ul>
      <ModeToggle />
    </div>
  );
}
