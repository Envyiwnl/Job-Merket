import { useCallback, useEffect, useMemo, useState } from "react";
import CandidateContext from "./CandidateContext";
import { useAuth } from "../customHooks/useAuth";
import { auth } from "../firebase/firebase";

export function CandidateProvider({ children }) {
  const { user } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const fetchMyApplications = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return [];
    }

    const token = await firebaseUser.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/applications/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load applications.");
    }

    return data.applications || [];
  }, []);

  const fetchMySavedJobs = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return [];
    }

    const token = await firebaseUser.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/saved-jobs/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load saved jobs.");
    }

    return data.savedJobs || [];
  }, []);

  const refreshApplications = useCallback(async () => {
    try {
      const candidateApplications = await fetchMyApplications();

      setApplications(candidateApplications);

      return candidateApplications;
    } catch (error) {
      console.error("Refresh applications error:", error);

      return [];
    }
  }, [fetchMyApplications]);

  const refreshSavedJobs = useCallback(async () => {
    try {
      const candidateSavedJobs = await fetchMySavedJobs();

      setSavedJobs(candidateSavedJobs);

      return candidateSavedJobs;
    } catch (error) {
      console.error("Refresh saved jobs error:", error);

      return [];
    }
  }, [fetchMySavedJobs]);

  const hasApplied = useCallback(
    (jobId) =>
      applications.some((application) => {
        const applicationJobId =
          typeof application.jobId === "object"
            ? application.jobId?._id
            : application.jobId;

        return applicationJobId === jobId;
      }),
    [applications],
  );

  const isJobSaved = useCallback(
    (jobId) =>
      savedJobs.some((savedJob) => {
        const savedJobId =
          typeof savedJob.jobId === "object"
            ? savedJob.jobId?._id
            : savedJob.jobId;

        return savedJobId === jobId;
      }),
    [savedJobs],
  );

  const toggleSavedJob = useCallback(
    async (jobId) => {
      try {
        const firebaseUser = auth.currentUser;

        if (!firebaseUser || user?.role !== "candidate") {
          return false;
        }

        const alreadySaved = isJobSaved(jobId);

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/saved-jobs/${jobId}`,
          {
            method: alreadySaved ? "DELETE" : "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update saved job.");
        }

        await refreshSavedJobs();

        return true;
      } catch (error) {
        console.error("Toggle saved job error:", error);

        return false;
      }
    },
    [user, isJobSaved, refreshSavedJobs],
  );

  useEffect(() => {
    if (user?.role !== "candidate") {
      setApplications([]);
      setSavedJobs([]);
      return;
    }

    const loadCandidateData = async () => {
      try {
        const candidateApplications = await fetchMyApplications();

        setApplications(candidateApplications);
      } catch (error) {
        console.error("Load applications error:", error);

        setApplications([]);
      }

      try {
        const candidateSavedJobs = await fetchMySavedJobs();

        setSavedJobs(candidateSavedJobs);
      } catch (error) {
        console.error("Load saved jobs error:", error);

        setSavedJobs([]);
      }
    };

    loadCandidateData();
  }, [user, fetchMyApplications, fetchMySavedJobs]);

  const value = useMemo(
    () => ({
      savedJobs,
      toggleSavedJob,
      isJobSaved,
      refreshSavedJobs,

      applications,
      hasApplied,
      refreshApplications,
    }),
    [
      savedJobs,
      toggleSavedJob,
      isJobSaved,
      refreshSavedJobs,
      applications,
      hasApplied,
      refreshApplications,
    ],
  );

  return <CandidateContext value={value}>{children}</CandidateContext>;
}
