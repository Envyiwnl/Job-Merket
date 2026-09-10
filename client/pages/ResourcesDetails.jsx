import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { auth } from "../src/firebase/firebase";
import PageLoader from "./PageLoader";

export default function ResourceDetails() {
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchResource() {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
          throw new Error("Authentication required.");
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/resources/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch resource.");
        }

        setResource(data.resource);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Resource fetch error:", error);
        setError(error.message || "Failed to fetch resource.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchResource();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (notFound) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
          <BookOpen className="h-12 w-12 text-slate-300" />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Resource not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The resource you're looking for doesn't exist.
          </p>

          <Link
            to="/resources"
            className="mt-6 rounded-xl bg-[#08C8B7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07B6A7]"
          >
            Browse Resources
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[#F8F9FA]">
        <div className="flex min-h-[400px] items-center justify-center px-5">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#08C8B7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>

        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="border-b border-slate-100 pb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#08C8B7]">
              {resource.category}
            </span>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {resource.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              {resource.description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" />
              <span>{resource.readTime}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
              {resource.content}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
