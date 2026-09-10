import { useSearchParams } from "react-router-dom";
import useFetch from "../src/customHooks/useFetch";
import JobCard from "./jobs/JobCard";
import { SearchX } from "lucide-react";
import Pagination from "./Pagination";

const JOBS_PER_PAGE = 6;

export default function OpportunityResults({
  fixedType = "",
  singularLabel = "Job",
  pluralLabel = "Jobs",
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "newest";

  const params = new URLSearchParams(searchParams);

  params.set("limit", JOBS_PER_PAGE);

  if (fixedType) {
    params.delete("type");
    params.append("type", fixedType);
  }

  const endpoint = `/api/jobs?${params.toString()}`;

  const { data, loading, error } = useFetch(endpoint);

  const jobs = data?.jobs || [];

  const pagination = data?.pagination || {
    page: 1,
    limit: JOBS_PER_PAGE,
    totalJobs: 0,
    totalPages: 0,
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);

    const value = e.target.value;

    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    params.delete("page");

    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading {pluralLabel.toLowerCase()}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-red-100 bg-white px-5 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {pagination.totalJobs}&nbsp;
            {pagination.totalJobs === 1 ? singularLabel : pluralLabel}
            &nbsp;Found
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Opportunities matching your current search and filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="job-sort"
            className="text-xs font-medium text-slate-500"
          >
            Sort by:
          </label>

          <select
            id="job-sort"
            value={sort}
            onChange={handleSortChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7]"
          >
            <option value="newest">Newest</option>

            <option value="salary-high">Salary: High to Low</option>

            <option value="salary-low">Salary: Low to High</option>
          </select>
        </div>
      </div>

      {jobs.length > 0 ? (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          <Pagination totalPages={pagination.totalPages} />
        </>
      ) : (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#08C8B7]/10">
            <SearchX className="h-6 w-6 text-[#08C8B7]" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            No {pluralLabel.toLowerCase()} found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try changing your search terms or removing some filters to find more
            opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
