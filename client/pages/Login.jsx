import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import AuthLayout from "../components/authentication/AuthLayout";
import { auth, googleProvider } from "../src/firebase/firebase";
import GoogleAuthButton from "../components/authentication/GoogleAuthButton";
import { useAuth } from "../src/customHooks/useAuth";

export default function Login({ isRecruiter = false }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function completeLogin() {
    const mongoUser = await refreshUser();

    if (!mongoUser) {
      await signOut(auth);

      throw new Error("Your account profile could not be found.");
    }

    const expectedRole = isRecruiter ? "recruiter" : "candidate";

    if (mongoUser.role !== expectedRole) {
      await signOut(auth);
      throw new Error(
        isRecruiter
          ? "This account is registered as a candidate."
          : "This account is registered as a recruiter.",
      );
    }

    const from = location.state?.from;

    const defaultDestination = isRecruiter ? "/recruiter/dashboard" : "/";

    const destination = from
      ? `${from.pathname}${from.search || ""}`
      : defaultDestination;

    navigate(destination, { replace: true });
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      await completeLogin();
    } catch (error) {
      console.error("Google login error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("");
      } else {
        setError(error.message || "Google sign in failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      await completeLogin();
    } catch (error) {
      console.error("Login error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(error.message || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={isRecruiter ? "Recruiter Login" : "Welcome Back"}
      description={
        isRecruiter
          ? "Sign in to manage job postings, applicants, and your hiring activity."
          : "Sign in to continue your job search and manage your applications."
      }
      footerText={
        isRecruiter
          ? "Don't have a recruiter account?"
          : "Don't have an account?"
      }
      footerLinkText={
        isRecruiter ? "Create recruiter account" : "Create account"
      }
      footerLinkTo={isRecruiter ? "/recruiter/register" : "/register"}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johnDoe@company.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              required
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#08C8B7] hover:text-[#07B6A7]"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {isRecruiter && (
            <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked
                disabled
                className="h-4 w-4 accent-[#08C8B7]"
              />
              Recruiter Account
            </label>
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#08C8B7] text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">OR</span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleAuthButton onClick={handleGoogleLogin} disabled={loading} />

        {!isRecruiter && (
          <div className="border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Hiring for your company? &nbsp;
              <Link
                to="/recruiter/login"
                className="font-semibold text-[#08C8B7] transition hover:text-[#07B6A7]"
              >
                Recruiter Login
              </Link>
            </p>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
