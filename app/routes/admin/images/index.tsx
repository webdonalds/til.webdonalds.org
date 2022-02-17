import { json, Link, LoaderFunction, useLoaderData, useSearchParams } from "remix";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { Button } from "~/components/atoms";
import { Alert } from "~/components/molecules/alert";
import { client, Image } from "~/lib/api/images.server";
import { useState } from "react";

export const loader: LoaderFunction = async () => {
  return json<Image[]>(await client.listImages());
};

export default function AdminImageIndex() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");
  const actionResult = searchParams.get("result");

  const [copiedId, setCopiedId] = useState<string | null>();
  const copyToClipboard = async ({ publicURL, id }: Image) => {
    await navigator.clipboard.writeText(publicURL);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const images = useLoaderData<Image[]>();
  return (
    <>
      <HeadingSubtitle>사진 관리</HeadingSubtitle>
      {action === "upload" && (
        <Alert color={actionResult === "success" ? "green" : "red"}>
          {actionResult === "success" ?
            <p>
              올리기에 성공했습니다. 다음 마크다운 문법을 이용할 수 있습니다.<br />
              <code>![이미지 설명]({images[0].publicURL})</code>
            </p> :
            <p>올리기에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
          }
        </Alert>
      )}

      <div className="flex my-4 space-x-1">
        <Link to="/admin/images/upload">
          <Button text="사진 올리기" color="blue" />
        </Link>
      </div>

      <div className="grid my-8 grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image) => (
          <div className="group h-36 rounded-lg bg-center bg-cover"
               key={`image-preview-${image.id}`}
               style={{ backgroundImage: `url("${image.thumbnailURL}")` }}
          >
            <div className="flex h-36 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition
                            items-center justify-center space-x-1 rounded-lg"
            >
              {copiedId === image.id ?
                <Button text="복사 완료" color="green" /> :
                <Button text="주소 복사" onClick={() => copyToClipboard(image)} />
              }
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
