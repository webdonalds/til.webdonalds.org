import { Link, Outlet } from "remix";
import { Header } from "~/components/organisms/header";

export default function PostIndex() {
  return (
    <div className="px-2 md:px-4">
      <Header />
      <Link to="/">
        <p className="font-bold hover:opacity-75 transition">
          ← 최신 글 목록
        </p>
      </Link>
      <Outlet />
    </div>
  );
}
