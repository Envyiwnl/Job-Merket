import { Building2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import useUrlFilters from "../../src/customHooks/useUrlFilters";

const industries = [
  { label: "All Industries", value: "" },
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Consulting", value: "consulting" },
  { label: "E-commerce", value: "e-commerce" },
  { label: "Media", value: "media" },
  { label: "Healthcare", value: "healthcare" },
];

export default function CompanySearchBar() {
  const { searchParams, setParams } = useUrlFilters();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");

  useEffect(() => {
    setKeyword(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
    setIndustry(searchParams.get("industry") || "");
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();
    setParams({ search: keyword.trim(), location: location.trim(), industry });
  }

  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Explore Companies
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Discover companies, explore their opportunities, and find the right
            place to grow your career.
          </p>
        </div>
        <form onSubmit={handleSearch} className="mt-7 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.5fr_1fr_1fr_auto]">
          <div className="relative flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0 md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-8 md:after:w-px md:after:-translate-y-1/2 md:after:bg-slate-200">
            <Search className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Company name or keyword"
              className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
            />
          </div>
          <div className="relative flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0 md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-8 md:after:w-px md:after:-translate-y-1/2 md:after:bg-slate-200">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
            />
          </div>
          <div className="flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0">
            <Building2 className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none sm:h-16 sm:text-sm"
            >
              {industries.map((industry) => (
                <option key={industry.label} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2">
            <button
              type="submit"
              className="h-11 w-full whitespace-nowrap rounded-xl bg-[#08C8B7] px-6 text-xs font-semibold text-white transition duration-200 hover:bg-[#07B6A7] sm:h-12 sm:text-sm md:h-full"
            >
              Search Companies
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
