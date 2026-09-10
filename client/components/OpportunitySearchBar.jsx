import useUrlFilters from "../src/customHooks/useUrlFilters";
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import useOpportunitySuggestions from "../src/customHooks/useOpportunitySuggestions";

export default function OpportunitySearchBar({
  title,
  description,
  keywordPlaceholder,
  buttonText,
  fixedType = "",
}) {
  const { searchParams, setParams } = useUrlFilters();

  const [keyword, setKeyword] = useState(searchParams.get("search") || "");

  const [location, setLocation] = useState(searchParams.get("location") || "");

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const { jobSuggestions, locationSuggestions } = useOpportunitySuggestions({
    keyword,
    location,
    fixedType,
  });

  useEffect(() => {
    setKeyword(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setShowLocationSuggestions(false);
    setParams({ search: keyword.trim(), location: location.trim() });
  };

  return (
    <section className="bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {description}
          </p>
        </div>
        <form
          onSubmit={handleSearch}
          className="mt-7 grid rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[1.8fr_1fr_auto]"
        >
          <div className="relative flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0 md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-8 md:after:w-px md:after:-translate-y-1/2 md:after:bg-slate-200">
            <Search className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowSuggestions(true);
                setShowLocationSuggestions(false);
              }}
              placeholder={keywordPlaceholder}
              autoComplete="off"
              className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
            />
            {showSuggestions && jobSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {jobSuggestions.map((job) => (
                  <button
                    key={job._id}
                    type="button"
                    onClick={() => {
                      setKeyword(job.title);
                      setShowSuggestions(false);
                    }}
                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                  >
                    <img
                      src={job.companyId.logoUrl}
                      alt={`${job.companyId.name} logo`}
                      className="h-8 w-8 shrink-0 object-contain"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {job.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {job.companyId.name} · {job.location}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationSuggestions(true);
                setShowSuggestions(false);
              }}
              autoComplete="off"
              placeholder="Location"
              className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
            />
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {locationSuggestions.map((locationName) => (
                  <button
                    key={locationName}
                    type="button"
                    onClick={() => {
                      setLocation(locationName);
                      setShowLocationSuggestions(false);
                    }}
                    className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-[#08C8B7]" />

                    <span className="truncate text-sm text-slate-700">
                      {locationName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-2">
            <button className="h-11 w-full whitespace-nowrap rounded-xl bg-[#08C8B7] px-6 text-xs font-semibold text-white transition duration-200 hover:bg-[#07B6A7] sm:h-12 sm:text-sm md:h-full">
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
