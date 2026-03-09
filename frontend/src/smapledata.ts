export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Friend extends User {
  lastMessage?: string;
  unreadCount?: number;
}

export const mockCurrentUser: User = {
  id: "current",
  name: "You",
  avatar: "",
  status: "online",
};

export const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "",
    status: "online",
    lastMessage: "Hey! Are you coming to the meetup?",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "",
    status: "online",
    lastMessage: "The project looks amazing 🔥",
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Jordan Taylor",
    avatar: "",
    status: "away",
    lastMessage: "Let me check and get back to you",
  },
  {
    id: "4",
    name: "Morgan Lee",
    avatar: "",
    status: "offline",
    lastMessage: "Thanks for sharing!",
    lastSeen: "2h ago",
  },
  {
    id: "5",
    name: "Casey Park",
    avatar: "",
    status: "online",
    lastMessage: "Can we reschedule the call?",
    unreadCount: 2,
  },
  {
    id: "6",
    name: "Riley Brooks",
    avatar: "",
    status: "offline",
    lastMessage: "See you tomorrow!",
    lastSeen: "5h ago",
  },
  {
    id: "7",
    name: "Jamie Walsh",
    avatar: "",
    status: "online",
    lastMessage: "That's a great idea 💡",
  },
  {
    id: "8",
    name: "Quinn Foster",
    avatar: "",
    status: "away",
    lastMessage: "I'll send the files shortly",
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", senderId: "1", text: "Hey! How's the project going?", timestamp: "10:30 AM", isOwn: false },
    { id: "m2", senderId: "current", text: "Going great! Almost done with the UI", timestamp: "10:32 AM", isOwn: true },
    { id: "m3", senderId: "1", text: "That's awesome! Can't wait to see it", timestamp: "10:33 AM", isOwn: false },
    { id: "m4", senderId: "current", text: "I'll share the preview link soon 🚀", timestamp: "10:35 AM", isOwn: true },
    { id: "m5", senderId: "1", text: "Perfect! Are you coming to the meetup?", timestamp: "10:40 AM", isOwn: false },
    { id: "m6", senderId: "1", text: "It's this Saturday at the usual place", timestamp: "10:40 AM", isOwn: false },
    { id: "m7", senderId: "1", text: "Hey! Are you coming to the meetup?", timestamp: "10:45 AM", isOwn: false },
  ],
  "2": [
    { id: "m8", senderId: "2", text: "Have you seen the latest design updates?", timestamp: "9:15 AM", isOwn: false },
    { id: "m9", senderId: "current", text: "Yes! They look incredible", timestamp: "9:20 AM", isOwn: true },
    { id: "m10", senderId: "2", text: "The project looks amazing 🔥", timestamp: "9:22 AM", isOwn: false },
  ],
  "3": [
    { id: "m11", senderId: "current", text: "Can you review the PR when you get a chance?", timestamp: "Yesterday", isOwn: true },
    { id: "m12", senderId: "3", text: "Let me check and get back to you", timestamp: "Yesterday", isOwn: false },
  ],
  "5": [
    { id: "m13", senderId: "5", text: "Hey, about tomorrow's call...", timestamp: "11:00 AM", isOwn: false },
    { id: "m14", senderId: "5", text: "Can we reschedule the call?", timestamp: "11:01 AM", isOwn: false },
  ],
};
