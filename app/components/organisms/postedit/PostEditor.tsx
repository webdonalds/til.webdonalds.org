import {
  LabeledInput,
  LabeledTextarea,
  SubmitButtons,
} from "~/components/molecules/form";
import { useState } from "react";
import { Button } from "~/components/atoms";
import { marked } from "marked";

type PostEditorProp = {
  defaultTitle?: string;
  defaultContent?: string;
  authorId?: number;
};

type PostEditorMode = "edit" | "preview";

export function PostEditor({
  defaultTitle,
  defaultContent,
  authorId,
}: PostEditorProp) {
  const [mode, setMode] = useState<PostEditorMode>("edit");
  const [content, setContent] = useState<string>(defaultContent || "");
  return (
    <>
      <div className={`${mode === "edit" ? "" : "hidden"} dark:text-gray-700`}>
        <LabeledInput
          name="title"
          type="text"
          label="제목"
          defaultValue={defaultTitle}
        />
        <LabeledTextarea
          name="content"
          label="본문"
          rows={20}
          defaultValue={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <input type="hidden" name="authorId" value={authorId} />

      <div className={mode === "edit" ? "hidden" : undefined}>
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div
            className="prose dark:prose-dark max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>
      </div>

      <SubmitButtons>
        <Button
          type="button"
          text={mode === "edit" ? "미리보기" : "편집"}
          onClick={() => {
            setMode(mode === "edit" ? "preview" : "edit");
          }}
        />
      </SubmitButtons>
    </>
  );
}
