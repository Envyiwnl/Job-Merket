import { Link } from "react-router-dom";
import { useAuth } from "../src/customHooks/useAuth";

export default function CTA() {
  const { user } = useAuth();

  const primaryLink = !user
    ? "/register"
    : user.role === "recruiter"
      ? "/recruiter/dashboard"
      : "/profile";

  const primaryText = !user
    ? "Create Free Account"
    : user.role === "recruiter"
      ? "Go to Dashboard"
      : "View Profile";

  return (
    <section className="bg-white px-5 py-16 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#08C8B7] px-6 py-14 text-center text-white sm:px-10 lg:py-20">
        <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full border-[30px] border-white/10" />

        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full border-[35px] border-white/10" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Start Your Journey
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Your next opportunity is waiting.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Create your Job-Merket profile and discover jobs and internships
            that match your skills, interests, and career goals.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={primaryLink}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#08C8B7] transition duration-200 hover:bg-slate-100"
            >
              {primaryText}
            </Link>

            <Link
              to="/jobs"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white/10"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
