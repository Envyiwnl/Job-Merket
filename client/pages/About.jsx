import { BriefcaseBusiness, Building2, Search, Users } from "lucide-react";

export default function About() {
  return (
    <main className="bg-[#F8F9FA]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            About Job-Merket
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Connecting talent with the right opportunities
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Job-Merket is a job and internship platform built to make the hiring
            process simpler for candidates and employers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#08C8B7]">What we do</p>

            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              A simpler way to discover and manage opportunities
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              Candidates can discover jobs and internships, save opportunities,
              manage applications, and keep their career profile updated in one
              place.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Recruiters can create their company profile, publish jobs, manage
              applicants, review resumes, and track hiring activity from a
              dedicated dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={Search}
              title="Discover Opportunities"
              description="Search jobs and internships that match your skills and interests."
            />

            <FeatureCard
              icon={Users}
              title="Candidate Management"
              description="Recruiters can review applicants and manage hiring decisions."
            />

            <FeatureCard
              icon={BriefcaseBusiness}
              title="Job Management"
              description="Create, edit, publish, close, and reopen job listings."
            />

            <FeatureCard
              icon={Building2}
              title="Company Profiles"
              description="Employers can maintain their company information and branding."
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:py-16 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Our goal
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            To create a straightforward platform where candidates can find
            meaningful opportunities and employers can connect with the talent
            they need.
          </p>

          <p className="mt-6 text-base font-semibold text-[#08C8B7]">
            Find. Apply. Grow.
          </p>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08C8B7]/10">
        <Icon className="h-5 w-5 text-[#08C8B7]" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
