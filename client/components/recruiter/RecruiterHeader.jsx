import { useAuth } from "../../src/customHooks/useAuth";
import { ChevronDown, UserRound, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/recruiter/dashboard": "Dashboard",
  "/recruiter/jobs/new": "Post a Job",
  "/recruiter/jobs": "Manage Jobs",
  "/recruiter/applicants": "Applicants",
  "/recruiter/profile": "Profile",
};

export default function RecruiterHeader({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();

  let title = pageTitles[location.pathname];
  if (/^\/recruiter\/jobs\/\d+\/edit$/.test(location.pathname)) {
    title = "Edit Job";
  }

  title ||= "Recruiter Portal";

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {title}
          </h1>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Recruiter Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Recruiter"}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {user?.companyName || "Company Account"}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08C8B7]/10 text-[#08C8B7]">
            {user?.name ? (
              <span className="text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserRound className="h-5 w-5" />
            )}
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
