import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/authentication/AuthLayout";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import GoogleAuthButton from "../components/authentication/GoogleAuthButton";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "../src/customHooks/useAuth";
import { auth, googleProvider } from "../src/firebase/firebase";

export default function Register({ isRecruiter = false }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function createMongoProfile(firebaseUser, name) {
    const token = await firebaseUser.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          role: isRecruiter ? "recruiter" : "candidate",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create user profile.");
    }
    return data;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleGoogleRegister() {
    setError("");
    setLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;

      const name =
        firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";

      await createMongoProfile(firebaseUser, name);

     const mongoUser =  await refreshUser();

     if(!mongoUser){
      setError("Account created, but failed to load your profile");
      return;
     }

      navigate(isRecruiter ? "/recruiter/dashboard" : "/");
    } catch (error) {
      console.error("Google registration error:", error);

      if (error.message === "User profile already exists.") {
        await signOut(auth);
        setError(
          "This Google account is already registered. Please sign in instead",
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("");
      } else {
        setError(error.message || "Google registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (
      !email.trim() ||
      !name.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password must match.");
      return;
    }
    setError("");
    setLoading(true);

    let firebaseUser = null;
    let mongoProfileCreated = false;

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      firebaseUser = credential.user;

      await updateProfile(firebaseUser, { displayName: name.trim() });
      await createMongoProfile(firebaseUser, name.trim());
      mongoProfileCreated = true;
      const mongoUser = await refreshUser();

      if(!mongoUser){
        setError("Account created, but failed to load your profile.");
        return;
      }

      navigate(isRecruiter ? "/recruiter/dashboard" : "/");
    } catch (error) {
      console.error("Registration error:", error);

      if (firebaseUser && !mongoProfileCreated) {
        try {
          await deleteUser(firebaseUser);
        } catch (deleteError) {
          console.error("Firebase rollback failed:", deleteError);
        }
      }

      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Please choose a strong password.");
      } else {
        setError(error.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={isRecruiter ? "Create Recruiter Account" : "Create Your Account"}
      description={
        isRecruiter
          ? "Create your recruiter account to post jobs and manage applicants."
          : "Create an account and start discovering opportunities."
      }
      footerText={
        isRecruiter
          ? "Already have a recruiter account?"
          : "Already have an account?"
      }
      footerLinkText="Sign in"
      footerLinkTo={isRecruiter ? "/recruiter/login" : "/login"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />
          </div>
        </div>

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
              placeholder="johnDoe@example.com"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <p className="mt-1.5 text-xs text-slate-400">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
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
        {isRecruiter && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[#08C8B7]"
            />
            Recruiter Account
          </label>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#08C8B7] text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
        >
          {loading
            ? "Creating Account..."
            : isRecruiter
              ? "Create Recruiter Account"
              : "Create Account"}
        </button>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">OR</span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleAuthButton onClick={handleGoogleRegister} disabled={loading} />
        {!isRecruiter && (
          <div className="border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Hiring for your company? &nbsp;
              <Link
                to="/recruiter/register"
                className="font-semibold text-[#08C8B7] transition hover:text-[#07B6A7]"
              >
                Create Recruiter Account
              </Link>
            </p>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
