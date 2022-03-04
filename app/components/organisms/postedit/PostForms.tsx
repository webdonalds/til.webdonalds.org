import { Form } from "remix";
import { LabeledInput, LabeledTextarea, SubmitButtons } from "~/components/molecules/form";
import { Post } from "~/models";

type PostEditorProp = {
  authorId: number;
  initData?: Post;
  onTitleChange: (_: string) => void;
  onContentChange: (_: string) => void;
};

export function PostForms({ initData, authorId, onTitleChange, onContentChange }: PostEditorProp) {
  return (
    <>
      <LabeledInput
        name="title"
        type="text"
        label="제목"
        defaultValue={initData?.title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <LabeledTextarea
        name="content"
        label="본문"
        rows={20}
        defaultValue={initData?.content}
        onChange={(e) => onContentChange(e.target.value)}
      />
      <input type="hidden" name="authorId" value={authorId} />

      <SubmitButtons />
    </>
  );
}
