import { Link } from "react-router-dom";
import useFetch from "../src/customHooks/useFetch";

export default function TopCompanies() {
  const { data, loading, error } = useFetch(
    "/api/companies?limit=6&sort=jobs-high",
  );

  const companies = data?.companies || [];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
              Trusted Employers
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Top Companies
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Discover opportunities from companies hiring talented people.
            </p>
          </div>

          <Link
            to="/companies"
            className="hidden text-sm font-semibold text-[#08C8B7] transition hover:text-[#07B6A7] sm:block"
          >
            View all companies &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <p className="text-sm text-slate-500">Loading companies...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="h-12 w-12 object-contain grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900 transition group-hover:text-[#08C8B7]">
                  {company.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {company.openJobs}&nbsp;
                  {company.openJobs === 1 ? "Job" : "Jobs"}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/companies"
            className="text-sm font-semibold text-[#08C8B7]"
          >
            View all companies &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
