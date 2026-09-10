import { UserPlus, Search, Send } from "lucide-react";

const steps = [
  {
    id: 1,
    number: "01",
    title: "Create Your Profile",
    description:
      "Create your account and showcase your skills, experience, and career interests.",
    icon: UserPlus,
  },
  {
    id: 2,
    number: "02",
    title: "Find Opportunities",
    description:
      "Search and discover jobs or internships that match your skills and preferences.",
    icon: Search,
  },
  {
    id: 3,
    number: "03",
    title: "Apply & Get Hired",
    description:
      "Apply to opportunities easily and take the next step toward your career.",
    icon: Send,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
            Simple Process
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Find Your Next Opportunity in 3 Steps
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Getting started with Job-Merket is simple. Create your profile,
            discover opportunities, and start applying.
          </p>
        </div>

        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-slate-200 md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#08C8B7]/20 bg-white shadow-sm">
                  <Icon className="h-7 w-7 text-[#08C8B7]" />
                </div>

                <span className="mt-5 text-xs font-bold tracking-wider text-[#08C8B7]">
                  STEP {step.number}
                </span>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
