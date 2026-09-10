import { LoaderCircle } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F9FA]">
      <div className="flex flex-col items-center">
        <LoaderCircle className="h-9 w-9 animate-spin text-[#08C8B7]" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading page...
        </p>
      </div>
    </div>
  );
}
