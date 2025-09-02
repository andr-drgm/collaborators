"use client";

interface NoProjectsMessageProps {
  onShowProjectModal: () => void;
}

export default function NoProjectsMessage({
  onShowProjectModal,
}: NoProjectsMessageProps) {
  return (
    <div className="w-full flex justify-center mb-12">
      <div className="liquid-glass p-8 rounded-2xl border border-white/10 max-w-2xl w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Projects Assigned
        </h3>
        <p className="text-white/70 mb-6">
          You haven&apos;t been assigned to any projects yet. Discover and join
          projects to start tracking your contributions.
        </p>
        <button
          onClick={onShowProjectModal}
          className="btn-primary px-6 py-3 text-sm font-semibold"
        >
          Discover Projects
        </button>
      </div>
    </div>
  );
}
