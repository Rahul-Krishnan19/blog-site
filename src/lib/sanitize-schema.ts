import { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";

/**
 * Extends the default sanitize schema so shiki (inline `style` for syntax
 * colors, `data-*` line/highlight markers) and the GitHub-alert plugin
 * (svg/path icons) survive sanitization. Posts come from the blog author's
 * own GitHub account, not arbitrary third parties — this is defense in
 * depth, not a hard security boundary.
 */
export const markdownSanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "svg", "path"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style", "dir"],
    span: [...(defaultSchema.attributes?.span ?? []), "data-line", "data-highlighted-line", "data-highlighted-chars", "data-rehype-pretty-code-mark"],
    code: [...(defaultSchema.attributes?.code ?? []), "data-line-numbers", "data-line-numbers-max-digits", "data-language", "data-theme"],
    pre: [...(defaultSchema.attributes?.pre ?? []), "data-language", "data-theme", "tabindex"],
    figure: [...(defaultSchema.attributes?.figure ?? []), "data-rehype-pretty-code-figure"],
    div: [...(defaultSchema.attributes?.div ?? []), "data-rehype-pretty-code-title"],
    svg: ["viewBox", "width", "height", "ariaHidden", "aria-hidden"],
    path: ["d"],
    input: [...(defaultSchema.attributes?.input ?? []), "type", "checked", "disabled"],
  },
};
