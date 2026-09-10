import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import useFetch from "../../src/customHooks/useFetch";
import CompanyCard from "./CompanyCard";
import Pagination from "../Pagination";

const COMPANIES_PER_PAGE = 6;

export default function CompanyResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "jobs-high";

  const params = new URLSearchParams(searchParams);

  params.set("limit", COMPANIES_PER_PAGE);

  const endpoint = `/api/companies?${params.toString()}`;

  const { data, loading, error } = useFetch(endpoint);

  const companies = data?.companies || [];

  const pagination = data?.pagination || {
    page: 1,
    limit: COMPANIES_PER_PAGE,
    totalCompanies: 0,
    totalPages: 0,
  };

  const handleChange = (e) => {
    const params = new URLSearchParams(searchParams);

    const value = e.target.value;

    if (value === "jobs-high") {
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
        <p className="text-sm text-slate-500">Loading companies...</p>
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
            {pagination.totalCompanies}
            &nbsp;
            {pagination.totalCompanies === 1 ? "Company" : "Companies"}
            &nbsp; Found
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Companies matching your current search and filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="company-sort"
            className="text-xs font-medium text-slate-500"
          >
            Sort by:
          </label>

          <select
            id="company-sort"
            value={sort}
            onChange={handleChange}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#08C8B7]"
          >
            <option value="jobs-high">Most Open Jobs</option>

            <option value="jobs-low">Least Open Jobs</option>

            <option value="name-asc">Name: A to Z</option>

            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {companies.length > 0 ? (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
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
            No companies found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try changing your search terms or removing some filters to discover
            more companies.
          </p>
        </div>
      )}
    </div>
  );
}
