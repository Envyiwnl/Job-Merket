import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../src/customHooks/useFetch";
import JobCard from "../jobs/JobCard";
import PageLoader from "../../pages/PageLoader";

export default function CompanyDetails() {
  const { id } = useParams();

  const { data, loading, error, status } = useFetch(`/api/companies/${id}`);

  const company = data?.company;
  const companyJobs = data?.jobs || [];

  const notFound = status === 404;

  if (loading) {
    return <PageLoader />;
  }

  if (notFound) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
          <Building2 className="h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Company not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The company you're looking for doesn't exist.
          </p>

          <Link
            to="/companies"
            className="mt-6 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            Browse Companies
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
          <Building2 className="h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <Link
            to="/companies"
            className="mt-6 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            Browse Companies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#08C8B7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white">
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="h-14 w-14 object-contain"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {company.name}
                  </h1>

                  {company.activelyHiring && (
                    <span className="rounded-full bg-[#08C8B7]/10 px-3 py-1 text-xs font-semibold text-[#059F92]">
                      Actively Hiring
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  {company.industry}
                </p>

                <div className="mt-4 flex flex-wrap gap-4">
                  <CompanyInfo icon={MapPin} text={company.location} />

                  <CompanyInfo icon={Users} text={company.size} />

                  <CompanyInfo
                    icon={BriefcaseBusiness}
                    text={`${company.openJobs} Open Jobs`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">
                About {company.name}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {company.description}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Open Positions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Opportunities currently available at {company.name}.
                  </p>
                </div>

                <span className="text-sm font-semibold text-[#08C8B7]">
                  {companyJobs.length}&nbsp;
                  {companyJobs.length === 1 ? "Job" : "Jobs"}
                </span>
              </div>

              {companyJobs.length > 0 ? (
                <div className="mt-6 grid gap-5">
                  {companyJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 px-5 py-10 text-center">
                  <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No open positions currently available.
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900">
              Company Overview
            </h2>

            <div className="mt-6 space-y-5">
              <OverviewItem label="Industry" value={company.industry} />

              <OverviewItem label="Company Size" value={company.size} />

              <OverviewItem label="Location" value={company.location} />

              <OverviewItem label="Open Jobs" value={company.openJobs} />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Work Modes
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {company.workModes.map((mode) => (
                    <span
                      key={mode}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {formatValue(mode)}
                    </span>
                  ))}
                </div>
              </div>

              {company.activelyHiring && (
                <div className="flex items-center gap-2 rounded-xl bg-[#08C8B7]/10 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#08C8B7]" />

                  <span className="text-sm font-medium text-[#059F92]">
                    Currently hiring
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CompanyInfo({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500">
      <Icon className="h-4 w-4 text-slate-400" />
      <span>{text}</span>
    </div>
  );
}

function OverviewItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function formatValue(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
