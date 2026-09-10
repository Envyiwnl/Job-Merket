import { Mail } from "lucide-react";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebase/firebase";
import AuthLayout from "../components/authentication/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());

      setSuccess("Password reset email sent. Please check your mail.");
    } catch (error) {
      console.error("Password reset error:", error);

      if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError(error.message || "Failed to send password reset email.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      description="Enter your email address and we'll send you instructions to reset your password."
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (error) {
                  setError("");
                }

                if (success) {
                  setSuccess("");
                }
              }}
              placeholder="johnDoe@example.com"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#08C8B7] text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </AuthLayout>
  );
}
