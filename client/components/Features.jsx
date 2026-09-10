import { BadgeCheck, Building2, TrendingUp, FileCheck2 } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Verified Opportunities",
    description: "Verified jobs and internships",
    icon: BadgeCheck,
  },
  {
    id: 2,
    title: "Top Companies",
    description: "Startups and global companies",
    icon: Building2,
  },
  {
    id: 3,
    title: "Grow Your Career",
    description: "Find opportunities to grow",
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "Easy Application",
    description: "Apply in just a few clicks",
    icon: FileCheck2,
  },
];

export default function Features() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className="flex items-center gap-4 border-b border-slate-100 px-4 py-8 sm:border-b-0 lg:px-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#08C8B7]/10">
                <Icon className="h-6 w-6 text-[#08C8B7]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
