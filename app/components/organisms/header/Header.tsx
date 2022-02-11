import { Link } from "remix";

export const Header = () => (
  <div className="py-16">
    <Link to="/" className="hover:opacity-75 transition">
      <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100">Today I Learned</p>
    </Link>
  </div>
);
