import OpportunitySearchBar from "../components/OpportunitySearchBar";
import OpportunityFilters from "../components/OpportunityFilters";
import OpportunityResults from "../components/OpportunityResults";

export default function Internships() {
  return (
    <main>
      <OpportunitySearchBar
        title="Find Internships"
        description="Discover internships and gain real-world experience with top companies."
        keywordPlaceholder="Internship title, keyword or company"
        buttonText="Search Internships"
        fixedType="Internship"
      />
      <section className="bg-[#F8F9FA] pb-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <OpportunityFilters showJobTypes={false} />

            <OpportunityResults
              fixedType="Internship"
              singularLabel="Internship"
              pluralLabel="Internships"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
