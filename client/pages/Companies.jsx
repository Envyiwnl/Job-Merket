import CompanySearchBar from "../components/companies/CompanySearchBar";
import CompanyFilters from "../components/companies/CompanyFilters";
import CompanyResults from "../components/companies/CompanyResults";

export default function Companies() {
  return (
    <main>
      <CompanySearchBar />
      <section className="bg-[#F8F9FA] pb-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <CompanyFilters />
            <CompanyResults />
          </div>
        </div>
      </section>
    </main>
  );
}
