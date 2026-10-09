"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, memo, useCallback } from "react";
import Image from "next/image";
import RippleGrid from "./ui/RippleGrid";

const HeroSection = memo(function HeroSection() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  const handleLogin = useCallback(() => {
    login();
  }, [login]);

  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard");
    }
  }, [authenticated, router]);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <RippleGrid
          enableRainbow={false}
          gridColor="#2b6fd6"
          rippleIntensity={0.05}
          gridSize={15}
          gridThickness={35}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={1}
          vignetteStrength={5}
          fadeDistance={0.2}
        />
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-brand-teal/15 blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-32 h-24 w-24 rounded-full bg-brand-blue/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 h-28 w-28 rounded-full bg-brand-blue/15 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Corner accents */}
      <div aria-hidden="true" className="hidden sm:block">
        <div className="absolute top-10 left-10 h-16 w-16 rounded-tl-xl border-t-2 border-l-2 border-brand-teal/50"></div>
        <div className="absolute top-10 right-10 h-16 w-16 rounded-tr-xl border-t-2 border-r-2 border-brand-blue/50"></div>
        <div className="absolute bottom-10 left-10 h-16 w-16 rounded-bl-xl border-b-2 border-l-2 border-brand-blue/50"></div>
        <div className="absolute bottom-10 right-10 h-16 w-16 rounded-br-xl border-b-2 border-r-2 border-brand-teal/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="relative h-32 w-32 animate-float sm:h-40 sm:w-40">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 blur-2xl"
            ></div>
            <Image
              src="/logo.svg"
              alt="Collaborators logo"
              width={160}
              height={160}
              priority
              className="relative h-full w-full object-contain"
            />
          </div>

          <div className="space-y-4">
            <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">
              Collaborators
            </h1>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              Transform your open source contributions into on-chain rewards and
              reputation
            </p>
          </div>

          <div className="card w-full p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-fg sm:text-xl">
              Get started in 3 simple steps
            </h2>
            <ol className="space-y-3 text-left">
              {[
                "Log in with GitHub",
                "Link your Solana wallet",
                "Start contributing and get rewarded",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3"
                >
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="font-medium text-fg/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-primary btn-lg group w-full max-w-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            Start Earning Rewards
          </button>

          <p className="text-base font-medium text-subtle sm:text-lg">
            Collaborate seamlessly. Build together.
          </p>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
