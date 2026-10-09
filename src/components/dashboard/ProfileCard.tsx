import Image from "next/image";
import { memo } from "react";

interface ProfileCardProps {
  imageUrl: string | undefined | null;
  name?: string | undefined | null;
  username: string | undefined | null;
  memberSince: string | undefined | null;
  className?: string;
  githubUsername?: string | undefined | null;
}

const ProfileCard = memo(function ProfileCard({
  imageUrl,
  username,
  memberSince,
  className = "",
  githubUsername,
}: ProfileCardProps) {
  const displayName = githubUsername ? `@${githubUsername}` : username;

  return (
    <section
      aria-label="Profile"
      className={`flex flex-col items-center ${className}`}
    >
      <div className="relative mb-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-brand-teal/25 to-brand-blue/25 blur-2xl"
        ></div>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayName ? `${displayName} avatar` : "Profile avatar"}
            className="relative h-24 w-24 rounded-full border-4 border-line-strong shadow-2xl sm:h-32 sm:w-32"
            width={128}
            height={128}
          />
        ) : (
          <div className="skeleton relative h-24 w-24 rounded-full sm:h-32 sm:w-32"></div>
        )}
      </div>

      <div className="card w-full max-w-sm p-6 text-center">
        {githubUsername ? (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 block break-all rounded text-2xl font-bold text-fg transition-colors hover:text-brand-teal"
          >
            @{githubUsername}
          </a>
        ) : username ? (
          <p className="mb-1 break-all text-2xl font-bold text-fg">{username}</p>
        ) : (
          <div className="skeleton mx-auto mb-2 h-8 w-48"></div>
        )}

        {memberSince ? (
          <p className="text-sm text-subtle">Member since {memberSince}</p>
        ) : (
          <div className="skeleton mx-auto h-5 w-40"></div>
        )}
      </div>
    </section>
  );
});

ProfileCard.displayName = "ProfileCard";

export default ProfileCard;
