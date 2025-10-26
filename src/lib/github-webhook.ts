import crypto from "crypto";

export function verifyGitHubWebhook(
  body: string,
  signature: string | null
): boolean {
  if (!signature) {
    return false;
  }

  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("GITHUB_WEBHOOK_SECRET not configured");
    return false;
  }

  const expectedSignature =
    "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
