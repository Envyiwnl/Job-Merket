import {Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Job-Merket-transparent.webp";
import { useAuth } from "../../src/customHooks/useAuth";
import {
  BriefcaseBusiness,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  UserRound,
  Users,
  X,
} from "lucide-react";

const recruiterLinks = [
  {
    name: "Dashboard",
    path: "/recruiter/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Post Job",
    path: "/recruiter/jobs/new",
    icon: FilePlus2,
  },
  {
    name: "Manage Jobs",
    path: "/recruiter/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Applicants",
    path: "/recruiter/applicants",
    icon: Users,
  },
  {
    name: "Profile",
    path: "/recruiter/profile",
    icon: UserRound,
  },
];

export default function RecruiterSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/recruiter/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 py-5">
        <Link
          to="/recruiter/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Job-Merket"
            className="h-20 w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recruiter Portal
        </p>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {recruiterLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#08C8B7]/10 text-[#08C8B7]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#08C8B7]"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
