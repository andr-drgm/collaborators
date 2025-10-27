import Image from "next/image";

interface ProfileCardProps {
  imageUrl: string | undefined | null;
  name?: string | undefined | null;
  username: string | undefined | null;
  memberSince: string | undefined | null;
  className?: string;
  githubUsername?: string | undefined | null;
}

export default function ProfileCard({
  imageUrl,
  username,
  memberSince,
  className = "",
  githubUsername,
}: ProfileCardProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Profile Image with enhanced styling */}
      <div className="relative mb-6">
        {imageUrl ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl scale-110"></div>
            <Image
              src={imageUrl}
              alt="Profile"
              className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl"
              width={128}
              height={128}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl scale-110"></div>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse border-4 border-white/20 shadow-2xl"></div>
          </div>
        )}
      </div>

      {/* Profile Info with liquid glass card */}
      <div className="liquid-glass rounded-2xl p-6 w-full max-w-sm text-center transition-all duration-500 hover:liquid-glass-hover">
        {githubUsername ? (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-white mb-2 hover:text-blue-400 transition-colors block"
          >
            @{githubUsername}
          </a>
        ) : username ? (
          <div className="text-2xl font-bold text-white mb-2">{username}</div>
        ) : (
          <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-2"></div>
        )}

        {memberSince ? (
          <div className="text-sm text-white/60">
            Member since: {memberSince}
          </div>
        ) : (
          <div className="h-5 w-40 bg-white/10 rounded-lg animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
