import { Link } from "react-router-dom";
import logo from "../assets/Job-Merket-transparent.webp";
const footerLinks = {
  candidates: [
    { name: "Find Jobs", path: "/jobs" },
    { name: "Internships", path: "/internships" },
    { name: "Companies", path: "/companies" },
    { name: "Categories", path: "/categories" },
  ],

  company: [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
  ],

  employers: [
    { name: "Post a Job", path: "/recruiter/jobs/new" },
    { name: "Manage Jobs", path: "/recruiter/jobs" },
    { name: "Recruiter Dashboard", path: "/recruiter/dashboard" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link to="/" className="inline-block">
            <img
              src={logo}
              alt="Job-Merket"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            Discover jobs and internships from growing startups and leading
            companies. Find the right opportunity and take the next step in your
            career.
          </p>
          <p className="mt-5 text-sm font-medium text-[#08C8B7]">
            Find. Apply. Grow.
          </p>
        </div>
        <FooterColumn title="For Candidates" links={footerLinks.candidates} />
        <FooterColumn title="Company" links={footerLinks.company} />
        <FooterColumn title="For Employers" links={footerLinks.employers} />
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>&copy; 2026 Job-Merket. All rights reserved.</p>
          <p>Built to connect talent with opportunity.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-sm text-slate-400 transition duration-200 hover:text-[#08C8B7]"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
