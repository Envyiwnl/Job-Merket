import JobCard from "../components/jobs/JobCard";
import { useCandidate } from "../src/customHooks/useCandidate";
import { Bookmark, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function SavedJobs() {
  const { savedJobs } = useCandidate();

  const savedJobList = savedJobs
    .map((saveJob) => saveJob.jobId)
    .filter(Boolean);

  return (
    <main className="min-h-[70vh] bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Your Opportunities
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Saved Jobs
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Keep track of opportunities you're interested in and come back to
            them whenever you're ready.
          </p>
        </div>

        {savedJobList.length > 0 ? (
          <>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                {savedJobList.length}&nbsp;
                {savedJobList.length === 1 ? "Saved Job" : "Saved Jobs"}
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {savedJobList.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08C8B7]/10">
              <Bookmark className="h-7 w-7 text-[#08C8B7]" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No saved jobs yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Save jobs you're interested in and they'll appear here for easy
              access later.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
            >
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
