import { Building2, MapPin, Users, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyCard({ company }) {
  return (
    <Link
      to={`/companies/${company._id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white">
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="h-10 w-10 object-contain grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 transition group-hover:text-[#08C8B7] sm:text-lg">
              {company.name}
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Building2 className="h-3.5 w-3.5" />

              <span>{company.industry}</span>
            </div>
          </div>
        </div>

        {company.activelyHiring && (
          <span className="shrink-0 rounded-full bg-[#08C8B7]/10 px-2.5 py-1 text-[10px] font-semibold text-[#059F92]">
            Hiring
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{company.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{company.size}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.workModes.map((mode) => (
          <span
            key={mode}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
          >
            {formatValue(mode)}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-[#08C8B7]" />

          <span className="text-sm font-semibold text-slate-700">
            {company.openJobs} {company.openJobs === 1 ? "Job" : "Jobs"}
          </span>
        </div>

        <span className="text-sm font-semibold text-[#08C8B7]">
          View Company &rarr;
        </span>
      </div>
    </Link>
  );
}

function formatValue(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
