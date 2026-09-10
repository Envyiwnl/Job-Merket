import logo from "../assets/Job-Merket-transparent.webp";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  X,
  Menu,
  ChevronDown,
  User,
  Bookmark,
  BriefcaseBusiness,
  LogOut,
} from "lucide-react";
import { useAuth } from "../src/customHooks/useAuth";

const navLinks = [
  { name: "Find Jobs", path: "/jobs" },
  { name: "Companies", path: "/companies" },
  { name: "Internships", path: "/internships" },
  { name: "Categories", path: "/categories" },
  { name: "Resources", path: "/resources" },
];

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isRecruiterPortal =
    location.pathname.startsWith("/recruiter/") &&
    location.pathname !== "/recruiter/login" &&
    location.pathname !== "/recruiter/register";

  if (isRecruiterPortal) {
    return null;
  }

  const navLinkStyle = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-[#08C8B7]" : "text-slate-600 hover:text-[#08C8B7]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Company Logo"
            className="h-22 w-auto object-contain"
          />
        </Link>
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((option) => (
            <NavLink
              key={option.path}
              to={option.path}
              className={navLinkStyle}
            >
              {option.name}
            </NavLink>
          ))}
        </div>
        {isAuthenticated ? (
          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
                aria-expanded={isProfileOpen}
                aria-label="Open profile menu"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C8B7]/10 text-sm font-semibold text-[#08C8B7]">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.name || "Candidate"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {user?.email || "Candidate account"}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    <Link
                      to="/saved-jobs"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                    >
                      <Bookmark className="h-4 w-4" />
                      Saved Jobs
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                    >
                      <BriefcaseBusiness className="h-4 w-4" />
                      Applications
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-lg border border-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-[#08C8B7] transition duration-200 hover:bg-[#08C8B7]/5"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-[#08C8B7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#07B6A7]"
            >
              Sign Up
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-5">
            <div className="flex flex-col gap-1">
              {navLinks.map((option) => (
                <NavLink
                  to={option.path}
                  key={option.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#08C8B7]/10 text-[#08C8B7]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#08C8B7]"
                    }`
                  }
                >
                  {option.name}
                </NavLink>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-5">
              {isAuthenticated ? (
                <div className="flex flex-col gap-1">
                  <div className="mb-3 flex items-center gap-3 px-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C8B7]/10 text-sm font-semibold text-[#08C8B7]">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user?.name || "Candidate"}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user?.email || "Candidate account"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>

                  <Link
                    to="/saved-jobs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                  >
                    <Bookmark className="h-4 w-4" />
                    Saved Jobs
                  </Link>

                  <Link
                    to="/applications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
                  >
                    <BriefcaseBusiness className="h-4 w-4" />
                    Applications
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-[#08C8B7] px-5 py-3 text-center text-sm font-semibold text-[#08C8B7]"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-[#08C8B7] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
