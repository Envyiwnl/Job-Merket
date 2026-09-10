import { BriefcaseBusiness, CalendarDays, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useCandidate } from "../src/customHooks/useCandidate";

export default function Applications() {
  const { applications } = useCandidate();

  const applicationList = applications.filter(
    (application) => application.jobId,
  );

  return (
    <main className="min-h-[70vh] bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Application Tracking
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Track the jobs you've applied for and monitor their current status.
          </p>
        </div>

        {applicationList.length > 0 ? (
          <div className="mt-8 space-y-4">
            {applicationList.map((application) => {
              const job = application.jobId;
              return (
                <div
                  key={application._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08C8B7]/10 text-[#08C8B7]">
                        <BriefcaseBusiness className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-base font-semibold text-slate-900 transition hover:text-[#08C8B7] sm:text-lg"
                        >
                          {job.title}
                        </Link>

                        <p className="mt-1 text-sm text-slate-500">
                          {job.companyId?.name || "Company"}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Applied {formatApplicationDate(application.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <ApplicationStatus status={application.status} />

                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-sm font-semibold text-[#08C8B7] transition hover:text-[#07B6A7]"
                      >
                        View Job &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08C8B7]/10">
              <BriefcaseBusiness className="h-7 w-7 text-[#08C8B7]" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No applications yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Once you apply for a job or internship, you'll be able to track
              its progress here.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
            >
              <Search className="h-4 w-4" />
              Find Jobs
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function ApplicationStatus({ status }) {
  const labels = {
    applied: "Applied",
    "under-review": "Under Review",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    hired: "Hired",
  };

  return (
    <span className="rounded-full bg-[#08C8B7]/10 px-3 py-1.5 text-xs font-semibold text-[#059F92]">
      {labels[status] || status}
    </span>
  );
}

function formatApplicationDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
