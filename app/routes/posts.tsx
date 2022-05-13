import { Link, Outlet } from "@remix-run/react";
import { Header } from "~/components/organisms/header";

export default function PostIndex() {
  return (
    <>
      <Header />
      <Link to="/">
        <p className="text-gray-900 dark:text-gray-100 font-bold hover:opacity-75 transition">
          ← 최신 글 목록
        </p>
      </Link>
      <Outlet />
    </>
  );
}
