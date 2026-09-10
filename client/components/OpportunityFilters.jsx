import { useState } from "react";
import useUrlFilters from "../src/customHooks/useUrlFilters";
import { categories } from "../src/data/categories";
import {
  ChevronDown,
  BriefcaseBusiness,
  Filter,
  RotateCcw,
  X,
} from "lucide-react";



const jobTypes = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Internship", value: "Internship" },
  { label: "Contract", value: "Contract" },
];

const experienceLevels = [
  { label: "Fresher", value: "Fresher" },
  { label: "Entry Level", value: "Entry Level" },
  { label: "Mid Level", value: "Mid Level" },
  { label: "Senior Level", value: "Senior Level" },
];

const workModes = [
  { label: "Remote", value: "Remote" },
  { label: "On-site", value: "On-site" },
  { label: "Hybrid", value: "Hybrid" },
];

export default function OpportunityFilters({ showJobTypes = true }) {
  const { searchParams, setParam, toggleParam, clearParams } = useUrlFilters();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = searchParams.get("category") || "";
  const selectedTypes = searchParams.getAll("type");
  const selectedExperience = searchParams.getAll("experience");
  const selectedModes = searchParams.getAll("mode");

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (showJobTypes ? selectedTypes.length : 0) +
    selectedExperience.length +
    selectedModes.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#08C8B7]" />
          <span className="text-sm font-semibold text-slate-800">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#08C8B7] px-1.5 text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <aside
        className={`rounded-2xl border border-slate-200 bg-white p-5 ${isOpen ? "block" : "hidden"} lg:block`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-[#08C8B7]" />
            <h2 className="font-semibold text-slate-900">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() =>
                clearParams(
                  showJobTypes
                    ? ["category", "type", "experience", "mode"]
                    : ["category", "experience", "mode"],
                )
              }
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-[#08C8B7]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
        <FilterSection title="Category">
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedCategory === category.value}
                  onChange={() =>
                    setParam(
                      "category",
                      selectedCategory === category.value ? "" : category.value,
                    )
                  }
                  className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
                />
                <span className="text-sm text-slate-600">{category.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
        {showJobTypes && (
          <FilterSection title="Job Type">
            <div className="space-y-3">
              {jobTypes.map((type) => (
                <label
                  key={type.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.value)}
                    onChange={() => toggleParam("type", type.value)}
                    className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
                  />

                  <span className="text-sm text-slate-600">{type.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        <FilterSection title="Experience Level">
          <div className="space-y-3">
            {experienceLevels.map((experience) => (
              <label
                key={experience.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedExperience.includes(experience.value)}
                  onChange={() => toggleParam("experience", experience.value)}
                  className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
                />

                <span className="text-sm text-slate-600">
                  {experience.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Work Mode">
          <div className="space-y-3">
            {workModes.map((mode) => (
              <label
                key={mode.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedModes.includes(mode.value)}
                  onChange={() => toggleParam("mode", mode.value)}
                  className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
                />

                <span className="text-sm text-slate-600">{mode.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-700 lg:hidden"
        >
          <X className="h-4 w-4" />
          Close Filters
        </button>
      </aside>
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-slate-100 py-6 last:border-b-0 last:pb-0">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>

      {children}
    </div>
  );
}
