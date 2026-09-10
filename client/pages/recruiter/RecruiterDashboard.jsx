import { BriefcaseBusiness, FilePlus2, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "../../src/firebase/firebase";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeJobs: 0,
      totalApplicants: 0,
      shortlisted: 0,
    },
    recentJobs: [],
    recentApplicants: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
          throw new Error("Authentication required.");
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/recruiter/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch dashboard data.");
        }

        setDashboardData({
          stats: data.stats,
          recentJobs: data.recentJobs || [],
          recentApplicants: data.recentApplicants || [],
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Dashboard fetch error:", error);

        setError(error.message || "Failed to fetch dashboard data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  const stats = [
    {
      label: "Active Jobs",
      value: dashboardData.stats.activeJobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Total Applicants",
      value: dashboardData.stats.totalApplicants,
      icon: Users,
    },
    {
      label: "Shortlisted",
      value: dashboardData.stats.shortlisted,
      icon: UserCheck,
    },
  ];

  const recentJobs = dashboardData.recentJobs;
  const recentApplicants = dashboardData.recentApplicants;

  if (loading) {
    return (
      <main className="flex min-h-[400px] items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-5 sm:p-6 lg:p-8">
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's an overview of your hiring activity.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
        >
          <FilePlus2 className="h-4 w-4" />
          Post a Job
        </Link>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Jobs</h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest job postings.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="text-sm font-semibold text-[#08C8B7] hover:text-[#07B6A7]"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {job.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {job.applicants}{" "}
                      {job.applicants === 1 ? "applicant" : "applicants"}{" "}
                      &nbsp;•&nbsp; {formatPostedDate(job.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      job.status === "open"
                        ? "bg-[#08C8B7]/10 text-[#059F92]"
                        : job.status === "closed"
                          ? "bg-red-50 text-red-500"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {formatJobStatus(job.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No recent jobs
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your latest job postings will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Applicants
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Candidates who recently applied.
              </p>
            </div>

            <Link
              to="/recruiter/applicants"
              className="text-sm font-semibold text-[#08C8B7] hover:text-[#07B6A7]"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentApplicants.length > 0 ? (
              recentApplicants.map((applicant) => (
                <div
                  key={applicant._id}
                  className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08C8B7]/10 text-sm font-semibold text-[#08C8B7]">
                      {applicant.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {applicant.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {applicant.jobTitle}
                      </p>
                    </div>
                  </div>

                  <ApplicationStatus status={applicant.status} />
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <Users className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No recent applicants
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  New applications will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#08C8B7]/10">
          <Icon className="h-5 w-5 text-[#08C8B7]" />
        </div>
      </div>
    </div>
  );
}

function ApplicationStatus({ status }) {
  const labels = {
    applied: "Applied",
    "under-review": "Under Review",
    shortlisted: "Shortlisted",
    hired: "Hired",
    rejected: "Rejected",
  };

  const styles = {
    applied: "bg-slate-100 text-slate-600",
    "under-review": "bg-blue-50 text-blue-600",
    shortlisted: "bg-amber-50 text-amber-600",
    hired: "bg-[#08C8B7]/10 text-[#059F92]",
    rejected: "bg-red-50 text-red-500",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatJobStatus(status) {
  if (status === "open") return "Active";
  if (status === "closed") return "Closed";
  if (status === "draft") return "Draft";

  return status;
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
