import ResourceCard from "../components/resources/ResourceCard";
import useFetch from "../src/customHooks/useFetch";
import PageLoader from "./PageLoader";

export default function Resources() {
  const { data, loading, error } = useFetch("/api/resources");

  const resources = data?.resources || [];

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="flex min-h-[400px] items-center justify-center px-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] pb-16">
      <section>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
              Career Support
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Career Resources
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Practical guides and advice to help you prepare for interviews,
              improve your applications, and grow your career.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
