type ErrorMessageProp = {
  emoji: string;
  message: string;
};

export function ErrorMessage({ emoji, message }: ErrorMessageProp) {
  return (
    <div className="p-8 text-center">
      <p className="m-8 text-8xl">{emoji}</p>
      <p className="m-4 font-bold text-2xl">{message}</p>
    </div>
  );
}