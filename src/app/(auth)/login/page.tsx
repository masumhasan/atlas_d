"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { saveSession, isAuthenticated } from "@/src/lib/auth";
import { loginAdmin } from "@/src/lib/api-client";
import { Spinner } from "@/src/components/ui/Spinner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginAdmin({ email, password });
      saveSession(result.token, result.user);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-atlas-bgLogin px-4">
      <div className="w-full max-w-109.75 rounded-xl border border-atlas-borderMuted bg-atlas-loginCard p-10">
        {/* Header */}
        <div className="text-center">
          <p className="font-serif text-2xl font-semibold tracking-[0.08em] text-cream">
            LMCS
          </p>

          <h1 className="mt-2 font-serif text-3xl text-atlas-text">
            Admin Sign In
          </h1>

          <p className="mt-2 text-sm text-atlas-textMuted">
            Sign in to manage LMCS website content.
          </p>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-text">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              disabled={isSubmitting}
              placeholder="Enter your admin email"
              autoComplete="email"
              className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-atlas-text">
                Password
              </label>

              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-[12px] font-semibold text-atlas-gold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                disabled={isSubmitting}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 pr-10 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textPlaceholder transition-colors hover:text-atlas-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-[13px] font-bold uppercase tracking-wider text-atlas-bg transition-all duration-200 hover:bg-atlas-goldLight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
