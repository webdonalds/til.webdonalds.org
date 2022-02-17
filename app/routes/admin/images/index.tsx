import { Link } from "remix";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { Button } from "~/components/atoms";

export default function AdminImageIndex() {
  return (
    <>
      <HeadingSubtitle>사진 관리</HeadingSubtitle>
      <div className="flex my-8 space-x-1">
        <Link to="/admin/images/upload">
          <Button text="사진 올리기" color="blue" />
        </Link>
      </div>
    </>
  );
};
