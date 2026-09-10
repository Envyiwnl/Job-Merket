import { useMemo, useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Mail,
  Search,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../../src/firebase/firebase";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function Applicants() {
  const [searchParams] = useSearchParams();

  const initialJob = searchParams.get("job") || "all";

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState(initialJob);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [openingResumeId, setOpeningResumeId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecruiterData() {
      try {
        setLoading(true);
        setFetchError("");

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
          throw new Error("Authentication required.");
        }

        const token = await firebaseUser.getIdToken();

        const [applicationsResponse, jobsResponse] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/applications/recruiter/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            },
          ),

          fetch(`${import.meta.env.VITE_API_URL}/api/jobs/recruiter/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }),
        ]);

        const [applicationsData, jobsData] = await Promise.all([
          applicationsResponse.json(),
          jobsResponse.json(),
        ]);

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message || "Failed to fetch applicants.",
          );
        }

        if (!jobsResponse.ok) {
          throw new Error(jobsData.message || "Failed to fetch jobs.");
        }

        setApplicants(applicationsData.applicants || []);
        setJobs(jobsData.jobs || []);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Fetch recruiter applicants error:", error);

        setFetchError(error.message || "Failed to fetch recruiter data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRecruiterData();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applicants
      .filter((applicant) => {
        const matchesSearch =
          !query ||
          applicant.name.toLowerCase().includes(query) ||
          applicant.email.toLowerCase().includes(query);

        const matchesJob =
          jobFilter === "all" || String(applicant.jobId) === jobFilter;

        const matchesStatus =
          statusFilter === "all" || applicant.status === statusFilter;

        return matchesSearch && matchesJob && matchesStatus;
      })
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [applicants, search, jobFilter, statusFilter]);

  async function updateApplicationStatus(applicationId, newStatus) {
    try {
      setUpdatingApplicationId(applicationId);
      setActionError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/status`,
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
        throw new Error(data.message || "Failed to update application status.");
      }

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === applicationId
            ? {
                ...applicant,
                status: data.application.status,
              }
            : applicant,
        ),
      );
    } catch (error) {
      console.error("Update application status error:", error);

      setActionError(error.message || "Failed to update application status.");

      throw error;
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  async function viewResume(applicationId) {
    const resumeWindow = window.open("", "_blank");

    if (!resumeWindow) {
      setResumeError(
        "Unable to open resume. Please allow pop-ups for this site.",
      );
      return;
    }

    resumeWindow.opener = null;

    try {
      setOpeningResumeId(applicationId);
      setResumeError("");

      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("Authentication required.");
      }

      const token = await firebaseUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${applicationId}/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let message = "Failed to fetch resume.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {}

        throw new Error(message);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      resumeWindow.location.href = fileUrl;

      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      resumeWindow.close();

      console.error("View resume error:", error);

      setResumeError(error.message || "Failed to open resume.");
    } finally {
      setOpeningResumeId(null);
    }
  }

  function handleAction(applicant, action) {
    setSelectedApplicant(applicant);
    setSelectedAction(action);
    setIsModalOpen(true);
  }

  async function confirmAction() {
    if (!selectedApplicant || !selectedAction) {
      return;
    }

    try {
      await updateApplicationStatus(selectedApplicant._id, selectedAction);

      closeModal();
    } catch {}
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedApplicant(null);
    setSelectedAction("");
  }

  const modalContent = getModalContent(selectedApplicant, selectedAction);

  return (
    <main className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Applicants
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Review candidates and manage their application status.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_200px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants..."
              className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08C8B7] focus:ring-2 focus:ring-[#08C8B7]/10"
            />
          </div>

          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-[#08C8B7]"
          >
            <option value="all">All Jobs</option>

            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-[#08C8B7]"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="under-review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
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
        {resumeError && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {resumeError}
          </div>
        )}

        {loading ? (
          <div className="mt-6 flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm text-slate-500">Loading applicants...</p>
          </div>
        ) : fetchError ? (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {fetchError}
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {filteredApplicants.length}&nbsp;
                {filteredApplicants.length === 1 ? "Applicant" : "Applicants"}
              </p>
            </div>
            {filteredApplicants.length > 0 ? (
              <div className="mt-4 space-y-4">
                {filteredApplicants.map((applicant, index) => {
                  const job = jobs.find(
                    (job) => String(job._id) === String(applicant.jobId),
                  );

                  return (
                    <ApplicantCard
                      key={applicant._id}
                      serialNumber={index + 1}
                      applicant={applicant}
                      job={job}
                      onAction={handleAction}
                      updatingApplicationId={updatingApplicationId}
                      onViewResume={viewResume}
                      openingResumeId={openingResumeId}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
                <UserRound className="h-9 w-9 text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No applicants found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalContent.title}
        description={modalContent.description}
        confirmText={modalContent.confirmText}
        variant={selectedAction === "rejected" ? "danger" : "default"}
        onClose={closeModal}
        onConfirm={confirmAction}
      />
    </main>
  );
}

function ApplicantCard({
  applicant,
  job,
  serialNumber,
  onAction,
  updatingApplicationId,
  onViewResume,
  openingResumeId,
}) {
  const isFinalStatus =
    applicant.status === "hired" || applicant.status === "rejected";
  const isUpdating = updatingApplicationId === applicant._id;
  const isOpeningResume = openingResumeId === applicant._id;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500">
            {serialNumber}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                {applicant.name}
              </h3>

              <ApplicationStatus status={applicant.status} />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {applicant.email}
              </span>

              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness className="h-4 w-4" />
                {job?.title || "Job unavailable"}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Applied {formatApplicationDate(applicant.appliedAt)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {applicant.hasResume && (
            <button
              type="button"
              onClick={() => onViewResume(applicant._id)}
              disabled={isOpeningResume}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />

              {isOpeningResume ? "Opening..." : "View Resume"}
            </button>
          )}

          {!isFinalStatus && (
            <>
              {applicant.status !== "shortlisted" && (
                <button
                  type="button"
                  onClick={() => onAction(applicant, "shortlisted")}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserCheck className="h-4 w-4" />
                  Shortlist
                </button>
              )}

              <button
                type="button"
                onClick={() => onAction(applicant, "hired")}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#08C8B7]/10 px-3 py-2 text-xs font-semibold text-[#059F92] transition hover:bg-[#08C8B7]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserCheck className="h-4 w-4" />
                Hire
              </button>

              <button
                type="button"
                onClick={() => onAction(applicant, "rejected")}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserX className="h-4 w-4" />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </article>
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function getModalContent(applicant, action) {
  if (!applicant) {
    return {
      title: "",
      description: "",
      confirmText: "Confirm",
    };
  }

  switch (action) {
    case "shortlisted":
      return {
        title: "Shortlist Applicant?",
        description: `${applicant.name} will be moved to your shortlisted candidates.`,
        confirmText: "Shortlist",
      };

    case "hired":
      return {
        title: "Hire Applicant?",
        description: `${applicant.name} will be marked as hired for this position.`,
        confirmText: "Confirm Hire",
      };

    case "rejected":
      return {
        title: "Reject Applicant?",
        description: `${applicant.name} will be moved to rejected applicants.`,
        confirmText: "Reject Applicant",
      };

    default:
      return {
        title: "",
        description: "",
        confirmText: "Confirm",
      };
  }
}

function formatApplicationDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
