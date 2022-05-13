import {
  ActionFunction,
  redirect,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";

import { Form, useOutletContext } from "@remix-run/react";
import { AdminUserContext } from "~/contexts/AdminUser";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { LabeledInput, SubmitButtons } from "~/components/molecules/form";
import { client } from "~/lib/api/images.server";

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = createMemoryUploadHandler({ maxFileSize: 10_000_000 });

  const reqData = await parseMultipartFormData(request, uploadHandler);
  const uploadUrl = await client.generateUploadUrl(reqData.get("uploaderId") as string);
  await client.uploadImage(uploadUrl, reqData.get("file") as File);

  return redirect("/admin/images?action=upload&result=success");
};

export default function UploadImage() {
  const { id: uploaderId } = useOutletContext<AdminUserContext>();
  return (
    <>
      <HeadingSubtitle>사진 올리기</HeadingSubtitle>
      <Form method="post" encType="multipart/form-data">
        <LabeledInput name="file" type="file" label="사진 첨부" />
        <input name="uploaderId" type="hidden" value={uploaderId.toString()} />
        <SubmitButtons />
      </Form>
    </>
  );
}
