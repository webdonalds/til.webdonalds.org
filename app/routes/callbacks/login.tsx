import { json, LoaderFunction, useCatch } from "remix";
import { ErrorMessage } from "~/components/templates/error";
import { authenticator } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const errorCode = url.searchParams.get("error_description");
  if (errorCode?.length > 0) {
    throw json({ code: errorCode }, { status: 403 });
  }

  await authenticator.authenticate("auth0", request, {
    successRedirect: "/admin",
  });
};

export function CatchBoundary() {
  const { data } = useCatch();
  let emoji;
  let message;
  switch (data.code) {
    case "email_not_verified":
      emoji = "✉️";
      message = "인증 메일을 전송했어요. 메일함을 확인해주세요.";
      break;
    default:
      emoji = "✋";
      message = "이 서비스는 허용된 사용자만 이용할 수 있어요.";
      break;
  }
  return <ErrorMessage emoji={emoji} message={message} />;
}

export default function LoginCallback() {
  return <></>;
}
