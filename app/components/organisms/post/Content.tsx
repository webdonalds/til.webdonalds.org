import dayjs from "dayjs";
import hljs from "highlight.js";
import { marked } from "marked";
import { Post } from "~/models";

type ContentProps = {
  data: Post;
};

export function Content({ data: post }: ContentProps) {
  marked.setOptions({
    highlight: (code, markedLang) => {
      const language = hljs.getLanguage(markedLang) ? markedLang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  });

  const { title, content, createdAt } = post;
  return (
    <div className="my-8 px-4 md:px-8 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="my-8 pb-8 border-b border-gray-300 dark:border-gray-700">
        <p className="text-sm font-bold">{dayjs(createdAt).format("YYYY. MM. DD.")}</p>
        <p className="my-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</p>
      </div>
      <article className="my-8 prose dark:prose-dark max-w-none break-words">
        <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
      </article>
    </div>
  );
}
