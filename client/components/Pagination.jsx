import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Pagination({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams);

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    setSearchParams(params);
  };

  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const pages = [];

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        Math.abs(page - currentPage) <= 1
      ) {
        pages.push(page);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      aria-label="Job results pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {visiblePages.map((page, index) => {
        const previousPage = visiblePages[index - 1];

        const showEllipsis = previousPage && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-1 text-sm text-slate-400">...</span>
            )}

            <button
              type="button"
              onClick={() => handlePageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition ${currentPage === page ? "border-[#08C8B7] bg-[#08C8B7] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-[#08C8B7] hover:text-[#08C8B7]"}`}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#08C8B7] hover:text-[#08C8B7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
