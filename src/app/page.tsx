import { getPublishedDiscussions } from "@/lib/github";
import { getYear } from "@/lib/dates";
import { PostListItem } from "@/components/PostListItem";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPublishedDiscussions();

  const byYear = new Map<number, typeof posts>();
  for (const post of posts) {
    const year = getYear(post.createdAt);
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        hi, i&apos;m writing here.
      </h1>
      <p className="text-muted mb-12">
        notes on what I&apos;m building and figuring out.
      </p>

      {posts.length === 0 ? (
        <p className="text-muted">nothing published yet — check back soon.</p>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-sm text-muted mb-1">{year}</h2>
              <div className="divide-y divide-border">
                {byYear.get(year)!.map((post) => (
                  <PostListItem key={post.number} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
