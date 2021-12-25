import { ReactNode } from "react";
import { useActionData, useTransition } from "remix";
import { Button } from "~/components/atoms";

export function SubmitButtons({ children }: { children?: ReactNode }) {
  const { state } = useTransition();
  return (
    <p className="block py-2 space-x-2">
      {state === "submitting" ?
        <Button type="submit" text="저장중..." color="blue" disabled /> :
        <Button type="submit" text="저장" color="blue" />
      }
      {children}
      {useActionData()?.error &&
        <span className="text-red-800">
          오류가 발생했어요. 잠시 후 다시 시도해주세요.
        </span>
      }
    </p>
  );
}
