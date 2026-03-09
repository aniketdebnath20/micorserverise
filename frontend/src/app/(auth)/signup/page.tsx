"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Missing email", {
        description: "Please enter your email.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // simulate API call for sending OTP

      const { data } = await axios.post(`http://localhost:5000/api/v1/login`, {
        email,
      });

      alert(data.message);
      router.push(`/verify-otp?email=${email}`);

      toast.success("OTP sent!", {
        description: "Check your email for the verification code.",
      });
    } catch (error) {
      toast.error("SignUp failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ChatterBox</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">Login</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter your email to receive a verification code
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

          {/* Button */}
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have a account?{" "}
          <Link href="/login" className="text-primary font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
