import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between mb-16">
      <Link href="/" className="font-semibold tracking-tight">
        home
      </Link>
      <ThemeToggle />
    </header>
  );
}
