import Image from "next/image";
import { Markdown } from "./Markdown";
import { formatPostDate } from "@/lib/dates";
import type { Discussion } from "@/lib/github";

export function Comments({ discussion }: { discussion: Discussion }) {
  const { comments, url } = discussion;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-muted">
          {comments.totalCount} comment{comments.totalCount === 1 ? "" : "s"}
        </h2>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:underline"
        >
          reply on GitHub
        </a>
      </div>

      {comments.totalCount === 0 ? (
        <p className="text-sm text-muted">no comments yet.</p>
      ) : (
        <ul className="space-y-6">
          {comments.nodes.map((comment) => (
            <li key={comment.id} className="flex gap-3">
              {comment.author && (
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.login}
                  width={32}
                  height={32}
                  className="rounded-full shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.author?.login ?? "ghost"}
                  </span>
                  <span className="text-xs text-muted">
                    {formatPostDate(comment.createdAt)}
                  </span>
                </div>
                <Markdown source={comment.body} />

                {comment.replies.nodes.length > 0 && (
                  <ul className="mt-4 space-y-4 border-l border-border pl-4">
                    {comment.replies.nodes.map((reply) => (
                      <li key={reply.id} className="flex gap-3">
                        {reply.author && (
                          <Image
                            src={reply.author.avatarUrl}
                            alt={reply.author.login}
                            width={24}
                            height={24}
                            className="rounded-full shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {reply.author?.login ?? "ghost"}
                            </span>
                            <span className="text-xs text-muted">
                              {formatPostDate(reply.createdAt)}
                            </span>
                          </div>
                          <Markdown source={reply.body} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
