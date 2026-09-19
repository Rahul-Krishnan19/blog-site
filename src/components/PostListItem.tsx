import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { buildSlug } from "@/lib/slug";
import type { DiscussionSummary } from "@/lib/github";

export function PostListItem({ post }: { post: DiscussionSummary }) {
  return (
    <Link
      href={`/blog/${buildSlug(post.number, post.title)}`}
      className="group flex items-baseline gap-4 py-2.5"
    >
      <span className="text-sm text-muted tabular-nums shrink-0 w-16">
        {formatShortDate(post.createdAt)}
      </span>
      <span className="text-foreground group-hover:text-accent transition-colors underline decoration-border underline-offset-4 group-hover:decoration-accent">
        {post.title}
      </span>
    </Link>
  );
}
