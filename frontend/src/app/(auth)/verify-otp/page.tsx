"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { useAppContextData } from "@/context/appcontext";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { isAuth, setIsAuth, setUser, fetchChats } = useAppContextData();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* redirect if email missing */
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  /* focus first input */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* resend countdown */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* handle OTP input */
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* keyboard navigation */
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* paste OTP */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const newOtp = [...otp];

    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  /* verify OTP */
  const verifyOtp = async (code: string) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_SERVICES_ROUTE}/api/v1/verify`,
        {
          email,
          otp: code,
        },
      );

      console.log(
        "email tnad code code her cejc h is the aeawierj",
        email,
        code,
      );

      setUser(data.user);
      setIsAuth(true);

      Cookies.set("token", data.token, {
        expires: 15,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      toast.success("Account verified", {
        description: "Welcome to ChatterBox",
      });
      fetchChats();

      router.push("/chat");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "OTP verification failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* submit handler */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      toast.error("Incomplete code", {
        description: "Please enter the full 6-digit code",
      });
      return;
    }

    await verifyOtp(code);
  };

  /* auto submit */
  useEffect(() => {
    const code = otp.join("");

    if (code.length === OTP_LENGTH && !otp.includes("")) {
      verifyOtp(code);
    }
  }, [otp]);

  /* resend OTP */
  const handleResend = async () => {
    if (timer > 0 || !email) return;

    try {
      setResendLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_SERVICES_ROUTE}/api/v1/login`,
        { email },
      );

      toast.success(data.message || "OTP resent");

      setTimer(60);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ChatterBox</span>
        </div>

        {/* Back */}
        <button
          onClick={() => router.push("/signup")}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title */}
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-1">Verify your email</h1>

          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* OTP */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-muted outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12">
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn’t get the code?{" "}
            <button
              disabled={timer > 0 || resendLoading}
              onClick={handleResend}
              className="text-primary font-semibold disabled:opacity-50"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
