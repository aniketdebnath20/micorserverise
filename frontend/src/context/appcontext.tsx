"use client";

import { useContext, useEffect, useState, createContext } from "react";
import { User, AppContextType, Chats } from "@/lib/types";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [chats, setChats] = useState<Chats[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  const logoutUser = async () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User Logged Out");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = Cookies.get("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_USER_SERVICES_ROUTE}/api/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log("User fetch failed", error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  }; // user

  const fetchChats = async () => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/chat/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setChats(data);
      console.log("appcotnment",data)
      console.log("appcotnment",data)
      console.log("appcotnment",data)
      console.log("appcotnment",data)
    } catch (error) {
      console.log("Chat fetch failed", error);
    }
  }; // all chat

  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      const token = Cookies.get("token");
      if (!token) {
        setIsAuth(false);
        return;
      }

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_USER_SERVICES_ROUTE}/api/v1/users/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(data.users);
      setIsAuth(true);
    } catch (error) {
      console.log("User fetch failed", error);
      logoutUser();
    } finally {
      setLoading(false);
    }
  }; // all users

  useEffect(() => {
    fetchUsers();
    fetchChats();
    fetchAllUsers();
  }, [isAuth]);



  console.log("app coinenchat dfata",chats)
  console.log("app coinenchat dfata",chats)
  console.log("app coinenchat dfata",chats)
  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        isAuth,
        setUser,
        setIsAuth,
        logoutUser,
        fetchUsers,
        fetchChats,
        chats,
        users,
        setChats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContextData = (): AppContextType => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContextData must be used within AppProvider");
  }

  return context;
};
