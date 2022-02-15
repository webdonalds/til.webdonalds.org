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
import { LabelText } from "~/components/atoms/form";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { LabeledInput, SubmitButtons } from "~/components/molecules/form";
import { client } from "~/lib/api/client.server";
import { authenticator } from "~/services/auth.server";

type ProfileData = {
  webdonalds_users: {
    auth_id: string;
    display_name: string;
    profile_image: string | null;
    blog_url: string | null;
    twitter_id: string | null;
    instagram_id: string | null;
    github_id: string | null;
    linked_in_id: string | null;
  }[];
};

type ProfileProp = {
  authId: string;
  displayName: string;
  profileImageUrl: string | null;
  blogUrl: string | null;
  twitterId: string | null;
  instagramId: string | null;
  githubId: string | null;
  linkedInId: string | null;
};

const query = gql<ProfileData>`
  query ($authId: String) {
    webdonalds_users(where: { auth_id: { _eq: $authId } }) {
      auth_id
      display_name
      profile_image
      blog_url
      github_id
      twitter_id
      instagram_id
      linked_in_id
    }
  }
`;

const mutation = gql`
  mutation (
    $authId: String!, $displayName: String!, $profileImageUrl: String,
    $blogUrl: String, $githubId: String, $twitterId: String,
    $instagramId: String, $linkedInId: String,
  ) {
    update_webdonalds_users(
      where: { auth_id: { _eq: $authId } },
      _set: {
        display_name: $displayName
        profile_image: $profileImageUrl
        blog_url: $blogUrl
        github_id: $githubId
        twitter_id: $twitterId
        instagram_id: $instagramId
        linked_in_id: $linkedInId
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
    blogUrl: user.blog_url,
    githubId: user.github_id,
    twitterId: user.twitter_id,
    instagramId: user.instagram_id,
    linkedInId: user.linked_in_id,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const reqData = await request.formData();
  const { error } = await client.mutation(mutation, {
    authId: reqData.get("authId"),
    displayName: reqData.get("displayName"),
    profileImageUrl: reqData.get("profileImageUrl"),
    blogUrl: reqData.get("blogUrl"),
    githubId: reqData.get("githubId"),
    twitterId: reqData.get("twitterId"),
    instagramId: reqData.get("instagramId"),
    linkedInId: reqData.get("linkedInId"),
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
        <LabeledInput
          name="displayName" type="text" label="이름"
          defaultValue={profile.displayName}
        />
        <LabeledInput
          name="profileImageUrl" type="text" label="프로필 사진 URL"
          defaultValue={profile.profileImageUrl || undefined}
          onChange={(e) => setPreviewUrl(e.target.value)}
        />
        {previewUrl &&
          <div className="py-2">
            <LabelText>프로필 사진 미리보기</LabelText>
            <img className="h-20 w-20 rounded-full" src={previewUrl} alt="프로필 사진 미리보기" />
          </div>
        }
        <LabeledInput name="blogUrl" type="text" label="블로그/홈페이지 주소" defaultValue={profile.blogUrl || undefined} />
        <LabeledInput name="githubId" type="text" label="깃허브 아이디" defaultValue={profile.githubId || undefined} />
        <LabeledInput name="twitterId" type="text" label="트위터 아이디" defaultValue={profile.twitterId || undefined} />
        <LabeledInput name="instagramId" type="text" label="인스타그램 아이디" defaultValue={profile.instagramId || undefined} />
        <LabeledInput name="linkedInId" type="text" label="링크드인 프로필 아이디" defaultValue={profile.linkedInId || undefined} />
        <input name="authId" type="hidden" value={profile.authId} />
        <SubmitButtons />
      </Form>
    </>
  );
}
