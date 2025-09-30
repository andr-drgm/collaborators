"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import RippleGrid from "./ui/RippleGrid";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-8 sm:py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <RippleGrid
          enableRainbow={true}
          gridColor="#0a84ff"
          rippleIntensity={0.05}
          gridSize={15}
          gridThickness={35}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={1}
          vignetteStrength={5}
          fadeDistance={0.2}
        />
        <div className="hidden sm:block absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="hidden sm:block absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="hidden sm:block absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Corner accents with refined styling */}
      <div className="hidden md:block absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-blue-400/60 rounded-tl-xl"></div>
      <div className="hidden md:block absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-xl"></div>
      <div className="hidden md:block absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-teal-400/60 rounded-bl-xl"></div>
      <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-blue-400/60 rounded-br-xl"></div>

      <div className="container max-w-md px-4 sm:px-6 z-10">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Logo with enhanced styling */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
            <div className="relative w-full h-full">
              <Image
                width={100}
                height={100}
                alt="Collab0rators Logo"
                decoding="async"
                data-nimg="fill"
                className="object-contain relative z-10"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
                src="/logo.png"
              />
            </div>
          </div>

          {/* Title with gradient text */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight gradient-text text-center">
            Collab0rators
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-center text-white/80 max-w-md leading-relaxed px-2">
            Transform your open source contributions into on-chain rewards and
            reputation
          </p>

          {/* Steps card with liquid glass effect */}
          <div className="liquid-glass rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full transition-all duration-500 hover:liquid-glass-hover">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 text-center">
              Get Started in 3 Simple Steps
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg flex-shrink-0">
                  1
                </div>
                <span className="text-sm sm:text-base text-white/90 font-medium">
                  Log in with GitHub
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg flex-shrink-0">
                  2
                </div>
                <span className="text-sm sm:text-base text-white/90 font-medium">
                  Link your Solana wallet
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg flex-shrink-0">
                  3
                </div>
                <span className="text-sm sm:text-base text-white/90 font-medium">
                  Start contributing and get rewarded
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full max-w-xs px-2">
            <button
              onClick={() => signIn("github", { redirectTo: "/dashboard" })}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              Start Earning Rewards
            </button>
          </div>

          {/* Tagline */}
          <p className="text-white/60 text-center mt-4 sm:mt-6 text-base sm:text-lg font-medium px-2">
            Collaborate seamlessly. Build together.
          </p>
        </div>
      </div>
    </section>
  );
}
