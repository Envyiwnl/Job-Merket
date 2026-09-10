import { useMemo, useCallback, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import AuthContext from "./AuthContext";
import { auth } from "../firebase/firebase";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const fetchMongoUser = useCallback(async (firebaseUser) => {
    const token = await firebaseUser.getIdToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || "Failed to load user profile.");

      error.status = response.status;

      throw error;
    }

    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setUser(null);
      return null;
    }

    setAuthLoading(true);
    setAuthError("");

    try {
      const mongoUser = await fetchMongoUser(firebaseUser);

      setUser(mongoUser);

      return mongoUser;
    } catch (error) {
      console.error("Refresh user error:", error);

      setUser(null);

      setAuthError(error.message || "Failed to load user profile.");

      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [fetchMongoUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      setAuthError("");

      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const mongoUser = await fetchMongoUser(firebaseUser);

        setUser(mongoUser);
      } catch (error) {
        console.error("Auth state restoration error:", error);

        setUser(null);

        if (error.status !== 404) {
          setAuthError(error.message || "Failed to restore your session.");
        }
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, [fetchMongoUser]);

  const logout = useCallback(async () => {
    try {
      setAuthError("");

      await firebaseSignOut(auth);

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);

      setAuthError("Failed to log out.");
    }
  }, []);

  const authValue = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      setAuthLoading,
      authError,
      setAuthError,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user),
    }),
    [user, authLoading, authError, logout, refreshUser],
  );

  return <AuthContext value={authValue}>{children}</AuthContext>;
}
