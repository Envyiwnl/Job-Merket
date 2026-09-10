import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../src/customHooks/useAuth";
import PageLoader from "../../pages/PageLoader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={allowedRoles?.includes("recruiter") ? "/recruiter/login" : "/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user?.role === "recruiter" ? "/recruiter/dashboard" : "/"}
        replace
      />
    );
  }

  return children;
}
