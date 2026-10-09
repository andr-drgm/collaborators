// Smoke check for the GitHub webhook bounty flow against a running dev server.
// Seeds a bounty + submission, then sends signed events and asserts the bounty is
// solved and the solver credited exactly once (incl. redelivery and issue-closed-first).
//
// Usage (LOCAL database only, the script refuses anything else):
//   DATABASE_URL=postgres://...@localhost:5432/db GITHUB_WEBHOOK_SECRET=... \
//   BASE_URL=http://localhost:3000 node scripts/check-webhook.mjs
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const { DATABASE_URL = "", GITHUB_WEBHOOK_SECRET: secret } = process.env;
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(DATABASE_URL)) {
  throw new Error("Refusing to seed test data: DATABASE_URL is not local");
}
assert.ok(secret, "GITHUB_WEBHOOK_SECRET is required");

const prisma = new PrismaClient();
const tag = `whcheck-${Date.now()}`;
const owner = `${tag}-Owner`; // mixed case: webhook sends lowercase below
const repo = "Repo";

function send(event, payload, sign = true) {
  const body = JSON.stringify(payload);
  const sig =
    "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
  return fetch(`${BASE_URL}/api/github/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-github-event": event,
      "x-hub-signature-256": sign ? sig : "sha256=bad",
    },
    body,
  });
}

const repository = { owner: { login: owner.toLowerCase() }, name: "repo" };
const merged = (n, author) => ({
  action: "closed",
  pull_request: { number: n, merged: true, user: { login: author } },
  repository,
});

async function seed(issue, pr) {
  const bounty = await prisma.bounty.create({
    data: {
      githubIssueId: issue,
      githubRepoOwner: owner,
      githubRepoName: repo,
      title: "t",
      description: "d",
      bountyAmount: "12.345",
      githubIssueUrl: `https://github.com/${owner}/${repo}/issues/${issue}`,
      bountyPoster: { connect: { id: poster.id } },
    },
  });
  await prisma.bountySubmission.create({
    data: {
      bountyId: bounty.id,
      userId: solver.id,
      prUrl: `https://github.com/${owner}/${repo}/pull/${pr}`,
      prNumber: pr,
    },
  });
  return bounty;
}

const tokens = async () =>
  (await prisma.user.findUniqueOrThrow({ where: { id: solver.id } }))
    .unclaimedTokens.toString();

const poster = await prisma.user.create({ data: { username: `${tag}-poster` } });
const solver = await prisma.user.create({ data: { username: `${tag}-Solver` } });

try {
  // Bad signature is rejected and changes nothing
  const b1 = await seed(1, 10);
  assert.equal((await send("pull_request", merged(10, `${tag}-solver`), false)).status, 401);

  // PR by someone else does not pay the submitter
  assert.equal((await send("pull_request", merged(10, "someone-else"))).status, 200);
  assert.equal(await tokens(), "0");

  // Merged PR by the submitter, delivered twice: solved, credited once
  for (let i = 0; i < 2; i++) {
    assert.equal((await send("pull_request", merged(10, `${tag}-solver`))).status, 200);
  }
  let b = await prisma.bounty.findUniqueOrThrow({ where: { id: b1.id } });
  assert.equal(b.status, "SOLVED");
  assert.equal(b.solvedBy, solver.id);
  assert.equal(await tokens(), "12.345");

  // issues.closed arriving before the PR event must not block the payout
  const b2 = await seed(2, 20);
  const closed = { action: "closed", issue: { number: 2 }, repository };
  assert.equal((await send("issues", closed)).status, 200);
  b = await prisma.bounty.findUniqueOrThrow({ where: { id: b2.id } });
  assert.equal(b.status, "CANCELLED");
  await send("pull_request", merged(20, `${tag}-solver`));
  await send("pull_request", merged(20, `${tag}-solver`));
  b = await prisma.bounty.findUniqueOrThrow({ where: { id: b2.id } });
  assert.equal(b.status, "SOLVED");
  assert.equal(await tokens(), "24.69");

  // Issue closed with no merged PR: bounty closes, nothing credited
  const b3 = await seed(3, 30);
  await send("issues", { ...closed, issue: { number: 3 } });
  b = await prisma.bounty.findUniqueOrThrow({ where: { id: b3.id } });
  assert.equal(b.status, "CANCELLED");
  assert.equal(await tokens(), "24.69");

  console.log("webhook check OK");
} finally {
  await prisma.user.deleteMany({ where: { username: { startsWith: tag } } });
  await prisma.$disconnect();
}
