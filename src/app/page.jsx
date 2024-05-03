import Link from "next/link";
import ButtonRedirect from "./components/ButtonRedirect";
import { redirect } from "next/navigation";

const isAuth = false;
export default function Home() {
  if (!isAuth) {
    redirect("/login");
  }
  return (
    <main>
      <ul>
        <li>
          <Link href="/login">Login</Link>
          <Link href="/register">register</Link>
        </li>
      </ul>
      <ButtonRedirect />
    </main>
  );
}
