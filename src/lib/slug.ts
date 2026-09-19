export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildSlug(number: number, title: string): string {
  const words = slugify(title);
  return words ? `${number}-${words}` : `${number}`;
}

export function parseNumberFromSlug(slug: string): number | null {
  const match = slug.match(/^(\d+)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}
