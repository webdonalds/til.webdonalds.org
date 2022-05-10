import { Panel } from "~/components/molecules/panel";

type ErrorMessageProps = {
  emoji: string;
  message: string;
};

export function ErrorMessage({ emoji, message }: ErrorMessageProps) {
  return (
    <Panel>
      <div className="p-8 text-center">
        <p className="m-8 text-8xl">{emoji}</p>
        <p className="m-4 font-bold text-2xl">{message}</p>
      </div>
    </Panel>
  );
}
