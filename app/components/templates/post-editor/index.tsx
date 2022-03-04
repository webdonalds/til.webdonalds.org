import { useState } from "react";
import { Button } from "~/components/atoms";
import { Content } from "~/components/organisms/post";
import { PostForms } from "~/components/organisms/postedit";
import { Post } from "~/models";

type PostEditorProps = {
  authorId: number;
  initData?: Post;
};

type PostEditorMode = "edit" | "preview";

export function PostEditor({ authorId, initData }: PostEditorProps) {
  const [currentMode, setMode] = useState<PostEditorMode>("edit");

  const [title, setTitle] = useState<string>(initData?.title || "");
  const [content, setContent] = useState<string>(initData?.content || "");

  return (
    <>
      {currentMode === "edit" ?
        <PostForms
          authorId={authorId}
          initData={{ title, content }}
          onTitleChange={setTitle}
          onContentChange={setContent}
        /> :
        <Content data={({ title, content, createdAt: new Date() })} />
      }
      <Button
        type="button"
        text={currentMode === "edit" ? "미리보기" : "고치기"}
        onClick={() => setMode(currentMode === "edit" ? "preview" : "edit")}
      />
    </>
  );
}
