import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#F8F9FA]">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-12 lg:px-8">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-500">
            {footerText} &nbsp;
            <Link
              to={footerLinkTo}
              className="font-semibold text-[#08C8B7] transition hover:text-[#07B6A7]"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
