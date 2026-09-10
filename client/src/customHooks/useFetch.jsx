import { useEffect, useState } from "react";

export default function useFetch(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          {
            signal: controller.signal,
          },
        );

        setStatus(response.status);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch data.");
        }

        setData(result);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Fetch error:", error);

        setError(error.message || "Failed to fetch data.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    status,
  };
}
