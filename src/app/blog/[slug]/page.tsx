import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDiscussionByNumber, getPublishedDiscussions } from "@/lib/github";
import { parseNumberFromSlug, buildSlug } from "@/lib/slug";
import { formatPostDate } from "@/lib/dates";
import { Markdown } from "@/components/Markdown";
import { Comments } from "@/components/Comments";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedDiscussions();
  return posts.map((post) => ({
    slug: buildSlug(post.number, post.title),
  }));
}

async function loadPost(slug: string) {
  const number = parseNumberFromSlug(slug);
  if (number === null) return null;
  return getDiscussionByNumber(number);
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await loadPost(slug);
  if (!post) return {};

  const description = post.body.slice(0, 160).replace(/\n/g, " ");

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt,
    },
  };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <header className="mb-10">
        <p className="text-sm text-muted mb-2">{formatPostDate(post.createdAt)}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
      </header>

      <Markdown source={post.body} />

      <Comments discussion={post} />
    </article>
  );
}
