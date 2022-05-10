import { Button } from "~/components/atoms";

type PageButtonsProps = {
  hasBefore: boolean;
  hasNext: boolean;
  currentPage: number,
  setPage: (page: number) => void;
}

export function PageButtons({ hasBefore, hasNext, currentPage, setPage }: PageButtonsProps) {
  return (
    <div className="text-center">
      <Button
        text="< 이전 페이지"
        disabled={!hasBefore}
        onClick={() => {
          setPage(currentPage - 1);
        }}
      />
      <Button
        text="다음 페이지 >"
        disabled={!hasNext}
        onClick={() => {
          setPage(currentPage + 1);
        }}
      />
    </div>
  );
}
