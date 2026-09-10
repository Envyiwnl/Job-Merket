import { useEffect, useState } from "react";

export default function useOpportunitySuggestions({
  keyword = "",
  location = "",
  fixedType = "",
}) {
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    const query = keyword.trim();

    if (query.length < 2) {
      setJobSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          search: query,
          limit: "5",
        });

        if (fixedType) {
          params.set("type", fixedType);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch suggestions.");
        }

        setJobSuggestions(data.jobs);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Suggestion fetch error:", error);
        setJobSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, fixedType]);

  useEffect(() => {
    const query = location.trim();

    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          location: query,
          limit: "10",
        });

        if (fixedType) {
          params.set("type", fixedType);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch location suggestions.",
          );
        }

        const uniqueLocations = [
          ...new Set(data.jobs.map((job) => job.location)),
        ];

        setLocationSuggestions(uniqueLocations);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Location suggestion error:", error);
        setLocationSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [location, fixedType]);

  return {
    jobSuggestions,
    locationSuggestions,
  };
}
