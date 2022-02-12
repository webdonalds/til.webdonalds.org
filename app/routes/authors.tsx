import { Link, Outlet } from "remix";
import { Header } from "~/components/organisms/header";

export default function AuthorIndex() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
