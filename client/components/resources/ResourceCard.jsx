import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResourceCard({ resource }) {
  return (
    <Link
      to={`/resources/${resource._id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#08C8B7]/40 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#08C8B7]/10">
        <BookOpen className="h-5 w-5 text-[#08C8B7]" />
      </div>

      <div className="mt-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#08C8B7]">
          {resource.category}
        </span>

        <h2 className="mt-2 text-lg font-semibold leading-7 text-slate-900 transition group-hover:text-[#08C8B7]">
          {resource.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {resource.description}
        </p>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            <span>{resource.readTime} min read</span>
          </div>

          <span className="flex items-center gap-1 text-sm font-semibold text-[#08C8B7]">
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
