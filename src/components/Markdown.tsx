import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkAlert from "remark-github-blockquote-alert";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSanitize from "rehype-sanitize";
import rehypeReact from "rehype-react";
import * as jsxRuntime from "react/jsx-runtime";
import { markdownSanitizeSchema } from "@/lib/sanitize-schema";

// rehype-pretty-code loads shiki grammars asynchronously, which is
// incompatible with react-markdown's synchronous processSync() — so this
// pipeline is built and run manually with the async .process() instead.
export async function Markdown({ source }: { source: string }) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark" },
    })
    .use(rehypeSanitize, markdownSanitizeSchema)
    .use(rehypeReact, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Fragment: jsxRuntime.Fragment as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsx: jsxRuntime.jsx as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsxs: jsxRuntime.jsxs as any,
    })
    .process(source);

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {file.result}
    </div>
  );
}
