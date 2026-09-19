import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Optional: register this as a GitHub webhook (repo Settings -> Webhooks)
 * on "Discussions" events, so a published/edited post shows up immediately
 * instead of waiting for the 5-minute ISR window in src/app/page.tsx and
 * src/app/blog/[slug]/page.tsx.
 */
export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 501 });
  }

  const signature = request.headers.get("x-hub-signature-256");
  const body = await request.text();

  if (!signature || !isValidSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event === "discussion") {
    revalidatePath("/");
    revalidatePath("/blog/[slug]", "page");
  }

  return NextResponse.json({ revalidated: event === "discussion" });
}

function isValidSignature(body: string, signature: string, secret: string): boolean {
  const expected = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}
