import { useState } from "react";
import heroImage from "../assets/Hero-section.webp";
import { useNavigate } from "react-router-dom";
import { MapPin, Search } from "lucide-react";
import useOpportunitySuggestions from "../src/customHooks/useOpportunitySuggestions";

const trendingSearches = [
  "Frontend Developer",
  "Data Analyst",
  "UI/UX Designer",
  "Marketing",
  "Sales",
];

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const { jobSuggestions, locationSuggestions } = useOpportunitySuggestions({
    keyword,
    location,
  });

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    setShowSuggestions(false);
    setShowLocationSuggestions(false);

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("search", keyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryString = params.toString();

    navigate(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleTrendingSearch = (search) => {
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="relative z-20 bg-[#F8F9FA]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#08C8B7]/5 blur-3xl"></div>
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#08C8B7]/10 blur-3xl"></div>
      </div>
      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#08C8B7]/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#08C8B7]" />
            <span className="text-sm font-medium text-[#059F92]">
              Find Opportunities. Build Your Future.
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find the right job
            <br />
            or internship for <span className="text-[#08C8B7]">you.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
            Discover thousands of job and internship opportunities from top
            companies and start your career journey today.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative z-30 mt-8 grid rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 md:grid-cols-[1.8fr_1fr_auto]"
          >
            <div
              className="relative flex min-w-0 items-center gap-2 border-b border-slate-100 px-4 sm:gap-3 sm:px-5 md:border-b-0 md:after:absolute
                md:after:right-0
                md:after:top-1/2
                md:after:h-8
                md:after:w-px
                md:after:-translate-y-1/2
                md:after:bg-slate-200"
            >
              <Search className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />

              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowSuggestions(true);
                  setShowLocationSuggestions(false);
                }}
                placeholder="Job title, keyword or company"
                autoComplete="off"
                className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
              />

              {showSuggestions && jobSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
                placeholder="Location"
                autoComplete="off"
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowLocationSuggestions(true);
                  setShowSuggestions(false);
                }}
                className="h-14 min-w-0 w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 sm:h-16 sm:text-sm"
              />

              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
              <button
                type="submit"
                className="h-11 w-full whitespace-nowrap rounded-xl bg-[#08C8B7] px-5 text-xs font-semibold text-white transition duration-200 hover:bg-[#07B6A7] sm:h-12 sm:px-6 sm:text-sm md:h-full"
              >
                Search Jobs
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-slate-700">
              Trending Searches:
            </span>

            {trendingSearches.map((search) => (
              <button
                key={search}
                type="button"
                onClick={() => handleTrendingSearch(search)}
                className="rounded-full bg-[#08C8B7]/10 px-3 py-1.5 text-xs font-medium text-[#059F92] transition duration-200 hover:bg-[#08C8B7]/20"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <img
            src={heroImage}
            alt="Job Seeker"
            className="relative z-10 w-full max-w-[620px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
