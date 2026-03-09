"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));














      toast.success("Welcome back!", {
        description: "You've been logged in successfully.",
      });

      router.push("/chat");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ChatterBox</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter your details to sign in
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <Label>Email</Label>

            <div className="relative pt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                type="email"
                placeholder="you@example.com"
                className="pl-9 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>

            <Input
              type="password"
              placeholder="••••••••"
              className="h-12 pt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full h-12"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        {/* Signup */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          New here?{" "}
          <Link href="/signup" className="text-primary font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}