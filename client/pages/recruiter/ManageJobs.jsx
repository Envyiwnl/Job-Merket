import { useMemo, useState, useEffect } from "react";
import { BriefcaseBusiness, Eye, Pencil, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../../src/firebase/firebase";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecruiterJobs() {
      try {
        setLoading(true);
        setFetchError("");

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
          throw new Error("Authentication required.");
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/recruiter/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs.");
        }

        setJobs(data.jobs || []);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Fetch recruiter jobs error:", error);

        setFetchError(error.message || "Failed to fetch jobs.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRecruiterJobs();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      const matchesStatus = status === "all" || job.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);
  async function updateJobStatus(jobId, newStatus) {
    try {
      setUpdatingJobId(jobId);
      setActionError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job status.");
      }

      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? {
                ...job,
                status: data.job.status,
              }
            : job,
        ),
      );
    } catch (error) {
      console.error("Update job status error:", error);

      setActionError(error.message || "Failed to update job status.");

      throw error;
    } finally {
      setUpdatingJobId(null);
    }
  }

  function handleCloseClick(job) {
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  async function confirmCloseJob() {
    if (!selectedJob) return;

    try {
      await updateJobStatus(selectedJob._id, "closed");

      setIsModalOpen(false);
      setSelectedJob(null);
    } catch {}
  }

  async function reopenJob(jobId) {
    try {
      await updateJobStatus(jobId, "open");
    } catch {}
  }

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Manage Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage all jobs posted by your company.
            </p>
          </div>

          <Link
            to="/recruiter/jobs/new"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Post a Job
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-[#08C8B7]"
          >
            <option value="all">All Jobs</option>
            <option value="open">Open</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {actionError}
          </div>
        )}
        {loading ? (
          <div className="mt-6 flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-500">Loading jobs...</p>
          </div>
        ) : fetchError ? (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {fetchError}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="mt-6 space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                        {job.title}
                      </h3>

                      <JobStatus status={job.status} />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {job.type}
                      &nbsp;•&nbsp;
                      {job.location}
                      &nbsp;•&nbsp;
                      {job.mode}
                    </p>

                    <div className="mt-3 text-xs text-slate-400">
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/recruiter/jobs/${job._id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <Link
                      to={`/recruiter/applicants?job=${job._id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7]"
                    >
                      <Eye className="h-4 w-4" />
                      Applicants
                    </Link>

                    {job.status === "open" ? (
                      <button
                        type="button"
                        onClick={() => handleCloseClick(job)}
                        disabled={updatingJobId === job._id}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                      >
                        Close Job
                      </button>
                    ) : job.status === "closed" ? (
                      <button
                        type="button"
                        onClick={() => reopenJob(job._id)}
                        disabled={updatingJobId === job._id}
                        className="rounded-lg bg-[#08C8B7]/10 px-3 py-2 text-xs font-semibold text-[#059F92] transition hover:bg-[#08C8B7]/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingJobId === job._id
                          ? "Reopening..."
                          : "Reopen Job"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
            <BriefcaseBusiness className="h-8 w-8 text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-900">No jobs found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Close this job?"
        description={
          selectedJob
            ? `Candidates will no longer be able to apply for ${selectedJob.title}.`
            : ""
        }
        confirmText="Close Job"
        variant="danger"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={confirmCloseJob}
      />
    </main>
  );
}

function JobStatus({ status }) {
  const styles = {
    open: "bg-[#08C8B7]/10 text-[#059F92]",
    draft: "bg-amber-50 text-amber-600",
    closed: "bg-slate-100 text-slate-500",
  };

  const labels = {
    open: "Open",
    draft: "Draft",
    closed: "Closed",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatDate(date) {
  if (!date) {
    return "recently";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
