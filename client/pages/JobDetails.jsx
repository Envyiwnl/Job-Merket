import { Link, useNavigate, useParams } from "react-router-dom";
import { auth } from "../src/firebase/firebase";
import { useState } from "react";
import useFetch from "../src/customHooks/useFetch";
import PageLoader from "./PageLoader";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  Clock3,
  MapPin,
  WalletCards,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../src/customHooks/useAuth";
import { useCandidate } from "../src/customHooks/useCandidate";

export default function JobDetails() {
  const { id } = useParams();
  const { data, loading, error, status } = useFetch(`/api/jobs/${id}`);
  const navigate = useNavigate();

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  const job = data?.job;

  const notFound = status === 404;
  const { user } = useAuth();
  const { toggleSavedJob, isJobSaved, hasApplied, refreshApplications } =
    useCandidate();

  const handleApply = async () => {
    try {
      setApplyError("");

      if (!user) {
        navigate("/login");
        return;
      }

      if (user.role !== "candidate") {
        setApplyError("Only candidates can apply for jobs.");
        return;
      }

      if (!user.resumeFileId) {
        setApplyError(
          "Please upload a resume from your profile before applying.",
        );
        return;
      }

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      setApplying(true);

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: id,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          await refreshApplications();
          return;
        }

        throw new Error(data.message || "Failed to submit application.");
      }

      await refreshApplications();
    } catch (error) {
      console.error("Application error:", error);

      setApplyError(error.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (notFound) {
    return (
      <main className="min-h-[60vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-20 text-center lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
          <p className="mt-3 text-sm text-slate-500">
            The job you are looking for may have been removed or does not exist
          </p>
          <Link
            to="/jobs"
            className="mt-6 rounded-xl bg-[#08C8B7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            Browse Jobs
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[60vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-20 text-center lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-red-600">{error}</p>

          <Link
            to="/jobs"
            className="mt-6 rounded-xl bg-[#08C8B7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            Browse Jobs
          </Link>
        </div>
      </main>
    );
  }

  const company = job.companyId;

  const companyLogoSrc = company?.logoFileId
    ? `${import.meta.env.VITE_API_URL}/api/companies/${company._id}/logo`
    : company?.logoUrl || "";

  const saved = isJobSaved(job._id);
  const applied = hasApplied(job._id);

  return (
    <main className="bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#08C8B7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white sm:h-20 sm:w-20">
                {companyLogoSrc ? (
                  <img
                    src={companyLogoSrc}
                    alt={`${company.name} logo`}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-500">
                    {company?.name?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {job.title}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Building2 className="h-4 w-4" />
                  <span>{company.name}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <JobInfo icon={MapPin} text={job.location} />
                  <JobInfo icon={Briefcase} text={formatValue(job.type)} />
                  <JobInfo icon={Clock3} text={formatValue(job.mode)} />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSavedJob(job._id)}
              aria-label={
                saved ? "Remove from saved jobs" : `Save ${job.title}`
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#08C8B7] hover:bg-[#08C8B7]/5 hover:text-[#08C8B7]"
            >
              <Bookmark
                className={`h-5 w-5 ${saved ? "fill-[#08C8B7] text-[#08C8B7]" : ""}`}
              />
            </button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-6">
          <JobSection title="Job Description">
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              {job.description}
            </p>
          </JobSection>
          <JobSection title="Responsibilities">
            <BulletList items={job.responsibilities} />
          </JobSection>
          <JobSection title="Requirements">
            <BulletList items={job.requirements} />
          </JobSection>
          <JobSection title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#08C8B7]/10 px-3 py-1.5 text-xs font-medium text-[#059F92]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </JobSection>
          <JobSection title="Benefits">
            <BulletList items={job.benefits} />
          </JobSection>
        </div>
        <aside>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Job Overview
            </h2>
            <div className="mt-6 space-y-5">
              <OverviewItem
                icon={WalletCards}
                label="Salary"
                value={formatSalary(job.salary)}
              />
              <OverviewItem
                icon={Briefcase}
                label="Job Type"
                value={formatValue(job.type)}
              />
              <OverviewItem
                icon={Building2}
                label="Experience"
                value={formatValue(job.experience)}
              />
              <OverviewItem
                icon={MapPin}
                label="Location"
                value={job.location}
              />
              <OverviewItem
                icon={Clock3}
                label="Work Mode"
                value={formatValue(job.mode)}
              />
              <OverviewItem
                icon={Clock3}
                label="Posted"
                value={formatPostedDate(job.createdAt)}
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={applied || applying}
              className="mt-7 w-full rounded-xl bg-[#08C8B7] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {applied ? "Applied" : applying ? "Applying..." : "Apply Now"}
            </button>
            {applyError && (
              <p className="mt-3 text-sm text-red-600">{applyError}</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function JobSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
        {title}
      </h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-6 text-slate-600 sm:text-base"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#08C8B7]" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function JobInfo({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

function OverviewItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#08C8B7]/10">
        <Icon className="h-4 w-4 text-[#08C8B7]" />
      </div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function formatValue(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSalary(salary) {
  if (!salary) {
    return "Salary not specified";
  }

  const { min, max, currency, period } = salary;

  const symbol = currency === "INR" ? "₹" : currency;

  if (period === "month") {
    return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()} / month`;
  }

  return `${symbol}${min}L - ${symbol}${max}L / year`;
}

function formatPostedDate(createdAt) {
  if (!createdAt) {
    return "";
  }

  const postedDate = new Date(createdAt);
  const today = new Date();

  const difference = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));

  if (difference <= 0) {
    return "Posted today";
  }

  if (difference === 1) {
    return "Posted 1 day ago";
  }

  return `Posted ${difference} days ago`;
}
