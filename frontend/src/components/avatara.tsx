import { User } from "@/smapledata";

interface AvatarCircleProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const sizeClasses = {
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
};

const statusSizeClasses = {
  sm: "w-2.5 h-2.5",
  md: "w-3 h-3",
  lg: "w-3.5 h-3.5",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Soft pastel palettes for avatars — unique per user
const avatarPalettes = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
];

const getPalette = (id: string) => {
  const index = id.charCodeAt(0) % avatarPalettes.length;
  return avatarPalettes[index];
};

const AvatarCircle = ({ user, size = "md", showStatus = true }: AvatarCircleProps) => {
  const palette = getPalette(user.id);

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-2xl ${palette.bg} ${palette.text} flex items-center justify-center font-bold tracking-tight`}
      >
        {getInitials(user.name)}
      </div>
      {showStatus && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${statusSizeClasses[size]} rounded-full border-2 border-card ${
            user.status === "online"
              ? "bg-online"
              : user.status === "away"
              ? "bg-away"
              : "bg-offline"
          }`}
        />
      )}
    </div>
  );
};

export default AvatarCircle;
