"use client";

interface HelpModalProps {
  isOpen: boolean;
  helpType: string | null;
  onClose: () => void;
}

const helpContent = {
  wallet:
    "Need help setting up your wallet? We support Phantom, Solflare, and other Solana wallets. Make sure you have some SOL for transaction fees.",
  commits:
    "This chart shows your GitHub contribution activity. Darker colors indicate more commits on that day. Hover over squares to see details.",
  tokens:
    "Tokens are earned based on your GitHub contributions. Each meaningful contribution (commits, PRs, reviews) earns you SOL tokens that you can claim to your wallet.",
};

export default function HelpModal({
  isOpen,
  helpType,
  onClose,
}: HelpModalProps) {
  if (!isOpen || !helpType || helpType === "") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white gradient-text">
            Help & Tips
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="text-white/80 text-base leading-relaxed">
          {helpContent[helpType as keyof typeof helpContent]}
        </p>
      </div>
    </div>
  );
}
