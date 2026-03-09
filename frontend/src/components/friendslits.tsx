import { Friend } from "@/smapledata";
import AvatarCircle from "./avatara";

interface FriendListItemProps {
  friend: Friend;
  isActive: boolean;
  onClick: () => void;
}

const FriendListItem = ({ friend, isActive, onClick }: FriendListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left
        ${isActive
          ? "bg-primary/8 shadow-sm"
          : "hover:bg-muted"
        }`}
    >
      <AvatarCircle user={friend} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-[13px] truncate text-foreground">
            {friend.name}
          </span>
          {friend.unreadCount && friend.unreadCount > 0 && (
            <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
              {friend.unreadCount}
            </span>
          )}
        </div>
        {friend.lastMessage && (
          <p className="text-xs text-muted-foreground truncate leading-relaxed">
            {friend.lastMessage}
          </p>
        )}
      </div>
    </button>
  );
};

export default FriendListItem;
