import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { useState } from "react";
import { gql } from "@urql/core";
import { SubmitButtons } from "~/components/molecules/form";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { client } from "~/lib/api/client";
import { authenticator } from "~/services/auth.server";

type ProfileData = {
  webdonalds_users: {
    auth_id: string;
    display_name: string;
    profile_image: string;
  }[];
};

type ProfileProp = {
  authId: string;
  displayName: string;
  profileImageUrl: string;
};

const query = gql<ProfileData>`
  query ($authId: String) {
    webdonalds_users(where: { auth_id: { _eq: $authId } }) {
      auth_id
      display_name
      profile_image
    }
  }
`;

const mutation = gql`
  mutation ($authId: String, $displayName: String, $profileImageUrl: String) {
    update_webdonalds_users(
      where: { auth_id: { _eq: $authId } },
      _set: {
        display_name: $displayName
        profile_image: $profileImageUrl
      },
    ) {
      returning {
        auth_id
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const authedUser = await authenticator.isAuthenticated(request);
  const { data } = await client.query(query, { authId: authedUser!!.id }).toPromise();
  if (!data) {
    throw json(null);
  }

  const user = data.webdonalds_users[0];
  return json<ProfileProp>({
    authId: user.auth_id,
    displayName: user.display_name,
    profileImageUrl: user.profile_image,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const reqData = await request.formData();
  const { error } = await client.mutation(mutation, {
    authId: reqData.get("authId"),
    displayName: reqData.get("displayName"),
    profileImageUrl: reqData.get("profileImageUrl"),
  }).toPromise();
  if (error) {
    return { error };
  }
  return redirect("/admin");
};

export default function ModifyProfile() {
  const profile = useLoaderData<ProfileProp>();
  const [previewUrl, setPreviewUrl] = useState(profile.profileImageUrl);
  return (
    <>
      <HeadingSubtitle>프로필 편집</HeadingSubtitle>
      <Form method="post">
        <label className="block py-2">
          <span className="my-2">이름</span>
          <input className="block rounded" name="displayName" type="text" defaultValue={profile.displayName} />
        </label>
        <label className="block py-2">
          <span className="my-2">프로필 사진 URL</span>
          <input
            className="block rounded w-full" name="profileImageUrl" type="text"
            defaultValue={profile.profileImageUrl} onChange={(e) => setPreviewUrl(e.target.value)}
          />
        </label>
        {previewUrl &&
          <div className="py-2">
            <span className="my-2">프로필 사진 미리보기</span>
            <img className="h-20 w-20 rounded-full" src={previewUrl} alt="프로필 사진 미리보기" />
          </div>
        }
        <input name="authId" type="hidden" value={profile.authId} />
        <SubmitButtons />
      </Form>
    </>
  );
}
