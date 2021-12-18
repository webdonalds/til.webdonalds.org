import { Link, Outlet } from "remix";
import { Header } from "~/components/header";

export default function PostIndex() {
  return (
    <>
      <Header />
      <Link to="/">
        <p className="py-4 font-bold hover:opacity-75 transition">
          ← 최신 글 목록
        </p>
      </Link>
      <Outlet />
    </>
  );
}
