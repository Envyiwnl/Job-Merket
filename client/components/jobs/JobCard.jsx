import { MapPin, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useCandidate } from "../../src/customHooks/useCandidate";

export default function JobCard({ job }) {
  const { toggleSavedJob, isJobSaved } = useCandidate();

  const saved = isJobSaved(job._id);

  const company = job.companyId;

  const companyLogoSrc = company?.logoFileId
    ? `${import.meta.env.VITE_API_URL}/api/companies/${company._id}/logo`
    : company?.logoUrl || "";

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white">
            {companyLogoSrc ? (
              <img
                src={companyLogoSrc}
                alt={`${company.name} logo`}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-slate-500">
                {company?.name?.charAt(0)?.toUpperCase() || "C"}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 transition group-hover:text-[#08C8B7] sm:text-lg">
              {job.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">{company.name}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleSavedJob(job._id)}
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-[#08C8B7]/10 hover:text-[#08C8B7]"
        >
          <Bookmark
            className={`h-5 w-5 ${
              saved ? "fill-[#08C8B7] text-[#08C8B7]" : ""
            }`}
          />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5" />
          {job.type}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
        <div>
          <p className="text-sm font-semibold text-slate-900 sm:text-base">
            {formatSalary(job.salary)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatPostedDate(job.createdAt)}
          </p>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="whitespace-nowrap rounded-lg bg-[#08C8B7] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#07B6A7] sm:px-5 sm:text-sm"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}

function formatSalary(salary) {
  if (!salary) return "Salary not specified";

  const { min, max, currency, period } = salary;

  const symbol = currency === "INR" ? "₹" : currency;

  if (period === "month") {
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} / month`;
  }

  return `${symbol}${min}L - ${symbol}${max}L / year`;
}

function formatPostedDate(createdAt) {
  if (!createdAt) return "";

  const postedDate = new Date(createdAt);
  const today = new Date();

  const difference = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));

  if (difference <= 0) return "Posted today";
  if (difference === 1) return "Posted 1 day ago";

  return `Posted ${difference} days ago`;
}
