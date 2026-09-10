import { Building2, ChevronDown, Filter, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import useUrlFilters from "../../src/customHooks/useUrlFilters";

const companySizes = [
  { label: "1 - 50 Employees", value: "1-50" },
  { label: "51 - 200 Employees", value: "51-200" },
  { label: "201 - 500 Employees", value: "201-500" },
  { label: "501 - 1000 Employees", value: "501-1000" },
  { label: "1000+ Employees", value: "1000-plus" },
];

const workModes = [
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "on-site" },
  { label: "Hybrid", value: "hybrid" },
];

export default function CompanyFilters() {
  const { searchParams, setParam, toggleParam, clearParams } = useUrlFilters();
  const [isOpen, setIsOpen] = useState(false);

  const selectedSizes = searchParams.getAll("size");
  const selectedModes = searchParams.getAll("mode");
  const activelyHiring = searchParams.get("hiring") === "true";

  const activeFilterCount =
    selectedSizes.length + selectedModes.length + (activelyHiring ? 1 : 0);

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
          className={`h-4 w-4 text-slate-500 transition duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <aside
        className={`rounded-2xl border border-slate-200 bg-white p-5 ${
          isOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#08C8B7]" />
            <h2 className="font-semibold text-slate-900">Filters</h2>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => clearParams(["size", "mode", "hiring"])}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-[#08C8B7]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
        <FilterSection title="Hiring Status">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={activelyHiring}
              onChange={() => setParam("hiring", activelyHiring ? "" : "true")}
              className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
            />

            <span className="text-sm text-slate-600">Actively Hiring</span>
          </label>
        </FilterSection>
        <FilterSection title="Company Size">
          <div className="space-y-3">
            {companySizes.map((size) => (
              <label
                key={size.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size.value)}
                  onChange={() => toggleParam("size", size.value)}
                  className="h-4 w-4 cursor-pointer accent-[#08C8B7]"
                />

                <span className="text-sm text-slate-600">{size.label}</span>
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
