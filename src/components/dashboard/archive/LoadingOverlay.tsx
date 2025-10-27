"use client";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = "Loading dashboard...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="liquid-glass rounded-3xl p-12 flex flex-col items-center">
        <div className="mb-6">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-xl text-blue-200 font-semibold">{message}</span>
      </div>
    </div>
  );
}
