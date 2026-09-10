import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[#F8F9FA]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#08C8B7]/10">
          <SearchX className="h-7 w-7 text-[#08C8B7]" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[#08C8B7]">
          404 Error
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          The page you're looking for may have been moved, removed, or the URL
          may be incorrect.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
