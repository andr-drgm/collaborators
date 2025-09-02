"use client";

import XLogo from "@/components/ui/XLogo";

interface TweetApprovalInfoProps {
  className?: string;
}

export default function TweetApprovalInfo({
  className = "",
}: TweetApprovalInfoProps) {
  return (
    <div
      className={`glass-card p-6 rounded-xl border border-blue-500/20 ${className}`}
    >
      <div className="flex items-start gap-4">
        <XLogo size="lg" />

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            X-Based Project Approval
          </h3>
          <p className="text-white/70 mb-3">
            To approve a project, users must post on X mentioning{" "}
            <span className="text-blue-400 font-medium">@collab0rators</span>{" "}
            and share the post URL.
          </p>
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Submit your project proposal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Post on X mentioning @collab0rators</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Share the post URL to approve the project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
