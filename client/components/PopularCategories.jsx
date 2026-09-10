import {
  BriefcaseBusiness,
  Code2,
  Database,
  Headphones,
  Megaphone,
  Palette,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import useFetch from "../src/customHooks/useFetch";

const categoryIcons = {
  development: Code2,
  "data-science": Database,
  design: Palette,
  marketing: Megaphone,
  business: TrendingUp,
  "customer-support": Headphones,
};

export default function PopularCategories() {
  const { data } = useFetch("/api/categories");
  const categories = data?.categories || [];
  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
              Browse Opportunities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Popular Categories
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Explore jobs and internships based on your field of interest.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden text-sm font-semibold text-[#08C8B7] transition hover:text-[#07B6A7] sm:block"
          >
            View all Categories &rarr;
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.value] || BriefcaseBusiness;

            return (
              <Link
                key={category._id}
                to={`/jobs?category=${category.value}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#08C8B7]/10 transition duration-300 group-hover:bg-[#08C8B7]">
                  <Icon className="h-6 w-6 text-[#08C8B7] transition duration-300 group-hover:text-white" />
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {category.opportunityCount}&nbsp;
                    {category.opportunityCount === 1
                      ? "Opportunity"
                      : "Opportunities"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/categories"
            className="text-sm font-semibold text-[#08C8B7]"
          >
            View all Categories &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
