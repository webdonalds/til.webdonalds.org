import { Link, Outlet } from "@remix-run/react";
import { Header } from "~/components/organisms/header";

export default function AuthorIndex() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
