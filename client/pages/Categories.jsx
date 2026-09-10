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
import PageLoader from "./PageLoader";
import useFetch from "../src/customHooks/useFetch";

const categoryIcons = {
  development: Code2,
  "data-science": Database,
  design: Palette,
  marketing: Megaphone,
  business: TrendingUp,
  "customer-support": Headphones,
};

export default function Categories() {
  const { data, loading, error } = useFetch("/api/categories");
  const categories = data?.categories || [];

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-24 lg:px-8">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] pb-16">
      <section>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Explore Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse opportunities by category and discover roles that match
              your skills and interests.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category.value] || BriefcaseBusiness;

              return (
                <Link
                  key={category._id}
                  to={`/jobs?category=${category.value}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#08C8B7]/10">
                    <Icon className="h-6 w-6 text-[#08C8B7]" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900 transition group-hover:text-[#08C8B7]">
                    {category.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                        {category.opportunityCount}
                        &nbsp;
                        {category.opportunityCount === 1
                          ? "Opportunity"
                          : "Opportunities"}
                      </span>

                      {category.internshipCount > 0 && (
                        <span className="rounded-full bg-[#08C8B7]/10 px-3 py-1.5 text-xs font-medium text-[#059F92]">
                          {category.internshipCount}
                          &nbsp;
                          {category.internshipCount === 1
                            ? "Internship"
                            : "Internships"}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-[#08C8B7]">
                        Explore Opportunities &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
