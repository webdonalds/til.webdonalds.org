import {
  ActionFunction,
  Form,
  redirect,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  useOutletContext,
} from "remix";
import { AdminUserContext } from "~/contexts/AdminUser";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { LabeledInput, SubmitButtons } from "~/components/molecules/form";

export const action: ActionFunction = async ({ request }) => {
  /**
   * You can't use this yet due to bug of Remix.
   * https://github.com/remix-run/remix/issues/1724
   */
  const uploadHandler = createMemoryUploadHandler({});
  const reqData = await parseMultipartFormData(request, uploadHandler);
  return redirect("/admin/images");
};

async function onSubmit() {

  console.log("click");
}

export default function UploadImage() {
  const { id: uploaderID } = useOutletContext<AdminUserContext>();
  return (
    <>
      <HeadingSubtitle>사진 올리기</HeadingSubtitle>
      <Form method="post" encType="multipart/form-data">
        <LabeledInput name="file" type="file" label="사진 첨부" />
        <SubmitButtons />
      </Form>
    </>
  );
}
