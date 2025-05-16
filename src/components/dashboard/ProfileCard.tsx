import Image from "next/image";

interface ProfileCardProps {
  imageUrl: string | undefined | null;
  name: string | undefined | null;
  username: string | undefined | null;
  memberSince: string | undefined | null;
  className?: string;
}

export default function ProfileCard({
  imageUrl,
  name,
  username,
  memberSince,
  className = "",
}: ProfileCardProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-zinc-800 shadow-lg mb-4"
          width={112}
          height={112}
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-zinc-700 animate-pulse border-4 border-zinc-800 shadow-lg mb-4"></div>
      )}

      {name ? (
        <div className="text-2xl font-bold">{name}</div>
      ) : (
        <div className="h-7 w-48 bg-zinc-700 rounded animate-pulse"></div>
      )}

      {username ? (
        <div className="text-lg text-gray-300">{username}</div>
      ) : (
        <div className="h-6 w-32 bg-zinc-700 rounded animate-pulse mt-1"></div>
      )}

      {memberSince ? (
        <div className="text-md text-gray-400 mt-1"> Member since: {memberSince}</div>
      ) : (
        <div className="h-5 w-40 bg-zinc-700 rounded animate-pulse mt-1"></div>
      )}
    </div>
  );
}
