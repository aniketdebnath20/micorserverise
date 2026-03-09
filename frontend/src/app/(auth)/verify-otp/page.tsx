"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* redirect if no email */
  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  /* resend timer */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];

    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length < 6) {
      toast.error("Incomplete code", {
        description: "Please enter the full 6-digit code.",
      });
      return;
    }

    try {
      setIsLoading(true);

      /* call your verify OTP API here */
      // simulate API call for sending OTP

      const { data } = await axios.post(`http://localhost:5000/api/v1/verify`, {
        otp,
      });

      alert(data.message);
      Cookies.set("token", data.token, {
        expries: 15,
        secure: false,
        path: "/",
      }); // or diffren way to set token and differn package of cookie
      // after that balck the otp filed and inputRef field
      // otp feild attyu balck emapyt

      toast.success("Account created!", {
        description: "Welcome to ChatterBox.",
      });

      router.push("/chat");
    } catch (error) {
      toast.error("OTP verification failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      setResendLoading(true);

      /* call resend OTP API */
      const { data } = await axios.post(`http://localhost:5000/api/v1/login`, {
        email,
      });
      alert(data.message);

      toast.success("OTP resent");
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-muted outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          {/* Button */}
          <Button type="submit" disabled={isLoading} className="w-full h-12">
            {isLoading ? "Verifying..." : "Verify & Continue"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apost get the code?{" "}
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
