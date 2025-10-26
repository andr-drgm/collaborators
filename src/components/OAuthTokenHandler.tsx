"use client";

import { useOAuthTokens } from "@privy-io/react-auth";

export default function OAuthTokenHandler() {
  // Handle OAuth tokens at the root level to ensure the hook is active
  // when users return from OAuth flows
  useOAuthTokens({
    onOAuthTokenGrant: ({ oAuthTokens }) => {
      if (oAuthTokens.provider === "github") {
        console.log("🎉 GitHub OAuth token received:", oAuthTokens.accessToken);
        // Store the token in localStorage so it can be accessed by other components
        localStorage.setItem("github_access_token", oAuthTokens.accessToken);

        // Dispatch a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("github-token-received", {
            detail: { token: oAuthTokens.accessToken },
          })
        );
      }
    },
  });

  return null; // This component doesn't render anything
}
