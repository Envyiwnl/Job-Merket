import OpportunityFilters from "../components/OpportunityFilters";
import OpportunityResults from "../components/OpportunityResults";
import OpportunitySearchBar from "../components/OpportunitySearchBar";

export default function Jobs() {
  return (
    <main>
      <OpportunitySearchBar
        title="Find Jobs"
        description="Search thousands of opportunities and find the right job for you."
        keywordPlaceholder="Job title, keyword or company"
        buttonText="Search Jobs"
      />
      <section className="bg-[#F8F9FA] pb-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <OpportunityFilters />
            <OpportunityResults />
          </div>
        </div>
      </section>
    </main>
  );
}
