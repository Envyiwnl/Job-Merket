import { Link } from "react-router-dom";
import JobCard from "./jobs/JobCard";
import useFetch from "../src/customHooks/useFetch";

export default function FeaturedJobs() {
  const { data, loading, error } = useFetch("/api/jobs?limit=4&sort=newest");

  const featuredJobs = data?.jobs || [];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
              Latest Opportunities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Featured Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Explore some of the latest jobs and internships available
            </p>
          </div>

          <Link
            to="/jobs"
            className="hidden text-sm font-semibold text-[#08C8B7] transition hover:text-[#07B6A7] sm:block"
          >
            Browse all jobs &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-slate-500">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/jobs" className="text-sm font-semibold text-[#08C8B7]">
            Browse all jobs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
