import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-20">
      <h1 className="text-xl font-semibold mb-2">not found</h1>
      <p className="text-muted mb-6">
        this page doesn&apos;t exist, or the post isn&apos;t published yet.
      </p>
      <Link href="/" className="text-accent hover:underline">
        back home
      </Link>
    </main>
  );
}
